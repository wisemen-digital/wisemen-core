import { createStubInstance, stub } from 'sinon'
import { DataSource, EntityManager, QueryRunner } from 'typeorm'

export function stubDataSource (): DataSource {
  const dataSource = createStubInstance(DataSource)

  dataSource.transaction.callsFake(async (arg1, arg2) => {
    const runInTransaction = typeof arg1 === 'function' ? arg1 : arg2

    return runInTransaction(createStubInstance(EntityManager))
  })

  dataSource.createQueryRunner.callsFake(() => ({
    manager: createStubInstance(EntityManager),
    release: stub().resolves(),
    isReleased: false
  } as unknown as QueryRunner))

  return dataSource
}
