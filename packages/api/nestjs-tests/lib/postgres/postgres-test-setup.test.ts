import { randomUUID } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Column, Entity, PrimaryColumn, type DataSourceOptions } from 'typeorm'
import { PostgresConcurrentTestSetup, PostgresTestSetup } from './postgres-test-setup.js'

@Entity('postgres_harness_probe')
class PostgresHarnessProbe {
  @PrimaryColumn({ type: 'uuid' })
  uuid: string

  @Column({ type: 'varchar' })
  value: string
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URI
}

describe('PostgresTestSetup', () => {
  let setup: PostgresTestSetup

  before(async () => {
    setup = await PostgresTestSetup.create({
      dataSourceOptions,
      entities: [PostgresHarnessProbe],
      packageName: 'nestjs-tests-harness'
    })
  })

  after(async () => {
    await setup.teardown()
  })

  it('rolls an ordinary repository test back', async () => {
    const uuid = randomUUID()
    const manager = await setup.beginRollbackTest()
    await manager.insert(PostgresHarnessProbe, { uuid, value: 'temporary' })
    await setup.rollbackTest()

    expect(await setup.dataSource.manager.findOneBy(PostgresHarnessProbe, { uuid })).toBeNull()
  })

  it('uses two PostgreSQL backends and observes a committed row after a lock wait', async () => {
    const uuid = randomUUID()
    await setup.dataSource.manager.insert(PostgresHarnessProbe, { uuid, value: 'initial' })

    const concurrent = await PostgresConcurrentTestSetup.create(setup.dataSource)
    expect(concurrent.backendPidFor(0)).not.toBe(concurrent.backendPidFor(1))

    let releaseWorkerA: (() => void) | undefined
    let workerAUpdated: (() => void) | undefined
    const workerAReady = new Promise<void>(resolve => { workerAUpdated = resolve })
    const release = new Promise<void>(resolve => { releaseWorkerA = resolve })

    const workerA = concurrent.inTransactionFor(0, async manager => {
      await manager.update(PostgresHarnessProbe, { uuid }, { value: 'committed-by-a' })
      workerAUpdated?.()
      await release
    })
    await workerAReady

    const workerB = concurrent.inTransactionFor(1, async manager => {
      await manager.update(PostgresHarnessProbe, { uuid }, { value: 'committed-by-b' })
      return await manager.findOneByOrFail(PostgresHarnessProbe, { uuid })
    })

    for (let attempt = 0; attempt < 100 && !await concurrent.isBlocked(1); attempt++) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    expect(await concurrent.isBlocked(1)).toBe(true)

    releaseWorkerA?.()
    await workerA
    expect((await workerB).value).toBe('committed-by-b')
    await concurrent.teardown()
  })

  it('isolates fixtures by package and worker schema', async () => {
    const other = await PostgresTestSetup.create({
      dataSourceOptions,
      entities: [PostgresHarnessProbe],
      packageName: 'nestjs-tests-other-suite'
    })

    try {
      const uuid = randomUUID()
      await setup.dataSource.manager.insert(PostgresHarnessProbe, { uuid, value: 'only-here' })

      expect(await other.dataSource.manager.findOneBy(PostgresHarnessProbe, { uuid })).toBeNull()
    } finally {
      await other.teardown()
    }
  })
})
