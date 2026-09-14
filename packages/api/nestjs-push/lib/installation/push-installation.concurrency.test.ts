import { randomBytes, randomUUID } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { PostgresConcurrentTestSetup, PostgresTestSetup } from '@wisemen/nestjs-tests/postgres'
import type { DataSourceOptions } from 'typeorm'
import { PushInstallation } from './push-installation.entity.js'
import { PushPlatform } from './push-platform.js'
import { hashPushToken } from './push-token-hash.js'
import {
  PushInstallationConflictError,
  PushInstallationRepository
} from './push-installation.repository.js'

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URI
}

/**
 * Exercise registration races through two independent PostgreSQL connections.
 */
describe('PushInstallationRepository concurrency', () => {
  let setup: PostgresTestSetup
  let concurrent: PostgresConcurrentTestSetup
  let workerA: PushInstallationRepository
  let workerB: PushInstallationRepository
  let reader: PushInstallationRepository
  let appScope: string

  before(async () => {
    setup = await PostgresTestSetup.create({
      dataSourceOptions,
      entities: [PushInstallation],
      packageName: 'nestjs-push-concurrent'
    })
    concurrent = await PostgresConcurrentTestSetup.create(setup.dataSource)

    expect(concurrent.backendPidFor(0)).not.toBe(concurrent.backendPidFor(1))

    workerA = new PushInstallationRepository(concurrent.managerFor(0))
    workerB = new PushInstallationRepository(concurrent.managerFor(1))
    reader = new PushInstallationRepository(setup.dataSource.manager)
  })

  after(async () => {
    await concurrent.teardown()
    await setup.teardown()
  })

  function command (overrides: Partial<{
    installationId: string
    installationSecret: string
    userUuid: string
    token: string
  }> = {}) {
    return {
      appScope,
      installationId: overrides.installationId ?? randomUUID(),
      installationSecret: overrides.installationSecret ?? randomBytes(32).toString('hex'),
      userUuid: overrides.userUuid ?? randomUUID(),
      token: overrides.token ?? `token-${randomUUID()}`,
      platform: PushPlatform.ANDROID,
      appVersion: null
    }
  }

  function freshScope (): void {
    appScope = `scope-${randomUUID()}`
  }

  async function activeHoldersOf (token: string): Promise<PushInstallation[]> {
    const all = await setup.dataSource.manager.findBy(PushInstallation, {
      appScope,
      tokenHash: hashPushToken(token)
    })

    return all.filter(installation => installation.revokedAt === null)
  }

  async function settle<T>(promise: Promise<T>): Promise<{ ok: boolean, error?: unknown }> {
    try {
      await promise

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  it('lets only one of two concurrent registrations of the same installation win', async () => {
    freshScope()
    const input = command()

    const [a, b] = await Promise.all([
      settle(workerA.upsertOne(input)),
      settle(workerB.upsertOne(input))
    ])

    const rows = await setup.dataSource.manager.findBy(PushInstallation, {
      appScope,
      installationId: input.installationId
    })
    expect(rows).toHaveLength(1)
    expect([a.ok, b.ok].filter(Boolean).length).toBeGreaterThanOrEqual(1)

    for (const result of [a, b]) {
      if (!result.ok) expect(result.error).toBeInstanceOf(PushInstallationConflictError)
    }
  })

  it('transfers a token between two installations of one user without leaving two holders',
    async () => {
      freshScope()
      const userUuid = randomUUID()
      const token = `token-${randomUUID()}`
      await reader.upsertOne(command({ userUuid, token }))

      const [transfer, heartbeat] = await Promise.all([
        settle(workerA.upsertOne(command({ userUuid, token }))),
        settle(workerB.upsertOne(command({ userUuid, token })))
      ])

      expect([transfer.ok, heartbeat.ok].filter(Boolean).length).toBeGreaterThanOrEqual(1)
      expect(await activeHoldersOf(token)).toHaveLength(1)
    })

  it('rejects a cross-account claim and leaves the owner registration intact', async () => {
    freshScope()
    const token = `token-${randomUUID()}`
    const owner = command({ token })
    const original = await reader.upsertOne(owner)

    const [claim, refresh] = await Promise.all([
      settle(workerA.upsertOne(command({ token }))),
      settle(workerB.upsertOne({ ...owner, token }))
    ])

    expect(claim.ok).toBe(false)
    expect(claim.error).toBeInstanceOf(PushInstallationConflictError)
    expect(refresh.ok).toBe(true)

    const reloaded = await reader.findOneActiveByUuid(original.uuid)
    expect(reloaded).not.toBeNull()
    expect(reloaded?.userUuid).toBe(owner.userUuid)
    expect(await activeHoldersOf(token)).toHaveLength(1)
  })

  it('leaves one active holder when a refresh and a transfer of the old token overlap',
    async () => {
      freshScope()
      const userUuid = randomUUID()
      const oldToken = `token-${randomUUID()}`
      const newToken = `token-${randomUUID()}`
      const install = command({ userUuid, token: oldToken })
      const original = await reader.upsertOne(install)

      const [refresh, transfer] = await Promise.all([
        settle(workerA.upsertOne({ ...install, token: newToken })),
        settle(workerB.upsertOne(command({ userUuid, token: oldToken })))
      ])

      expect(refresh.ok).toBe(true)
      expect(transfer.ok).toBe(true)

      const refreshed = await reader.findOneActiveByUuid(original.uuid)
      expect(refreshed).not.toBeNull()
      expect(refreshed?.tokenHash).toBe(hashPushToken(newToken))
      expect(await activeHoldersOf(newToken)).toHaveLength(1)
    })

  /**
   * Reproduce the release query directly because the race between its read and update cannot be
   * controlled through the public method.
   */
  it('cannot release a token from an installation that has since refreshed', async () => {
    freshScope()
    const userUuid = randomUUID()
    const oldToken = `token-${randomUUID()}`
    const newToken = `token-${randomUUID()}`
    const install = command({ userUuid, token: oldToken })
    const original = await reader.upsertOne(install)

    const staleHolderUuid = original.uuid

    await workerA.upsertOne({ ...install, token: newToken })

    // The stale release must also match the old token. node-postgres returns rows and their count.
    const [releasedRows, affected] = await concurrent.managerFor(1).query(
      `UPDATE "push_installation"
          SET "revokedAt" = now(), "revokedReason" = 'token_moved_to_other_installation'
        WHERE "uuid" = $1 AND "tokenHash" = $2 AND "revokedAt" IS NULL
        RETURNING "uuid"`,
      [staleHolderUuid, hashPushToken(oldToken)]
    ) as [unknown[], number]

    expect(releasedRows).toHaveLength(0)
    expect(affected).toBe(0)

    const survivor = await reader.findOneActiveByUuid(original.uuid)
    expect(survivor).not.toBeNull()
    expect(survivor?.tokenHash).toBe(hashPushToken(newToken))
  })

  /**
   * Hold an ownership change open to verify that the token transfer waits for the row lock before
   * deciding whether it may release the existing installation.
   */
  it('cannot release a token from an installation that changed owner while it was checked',
    async () => {
      freshScope()
      const userA = randomUUID()
      const userB = randomUUID()
      const token = `token-${randomUUID()}`
      const holder = await reader.upsertOne(command({ userUuid: userA, token }))

      let commitSwitch: (() => void) | undefined
      let switchPending: (() => void) | undefined
      const pending = new Promise<void>(resolve => { switchPending = resolve })
      const commit = new Promise<void>(resolve => { commitSwitch = resolve })

      // Change the owner while keeping the transaction open.
      const accountSwitch = concurrent.inTransactionFor(0, async (manager) => {
        await manager.query(
          'UPDATE "push_installation" SET "userUuid" = $1 WHERE "uuid" = $2',
          [userB, holder.uuid]
        )
        switchPending?.()
        await commit
      })
      await pending

      // This transfer must wait until the ownership change commits.
      const transfer = settle(workerB.upsertOne(command({ userUuid: userA, token })))

      for (let attempt = 0; attempt < 200 && !await concurrent.isBlocked(1); attempt++) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      expect(await concurrent.isBlocked(1)).toBe(true)

      commitSwitch?.()
      await accountSwitch

      const claim = await transfer

      expect(claim.ok).toBe(false)
      expect(claim.error).toBeInstanceOf(PushInstallationConflictError)

      const untouched = await reader.findOneActiveByUuid(holder.uuid)
      expect(untouched).not.toBeNull()
      expect(untouched?.userUuid).toBe(userB)
    })

  it('does not revoke a generation that a concurrent refresh already replaced', async () => {
    freshScope()
    const input = command()
    const first = await reader.upsertOne(input)

    const [refresh, revoke] = await Promise.all([
      settle(workerA.upsertOne({ ...input, token: `token-${randomUUID()}` })),
      settle(workerB.revokeOneIfGenerationMatches(
        first.uuid,
        first.tokenGeneration,
        'unregistered'
      ))
    ])

    expect(refresh.ok).toBe(true)
    expect(revoke.ok).toBe(true)

    const reloaded = await setup.dataSource.manager.findOneByOrFail(PushInstallation, {
      uuid: first.uuid
    })

    // A revoked row may only contain the generation that produced the provider result.
    if (reloaded.revokedAt !== null) {
      expect(reloaded.tokenGeneration).toBe(first.tokenGeneration)
    } else {
      expect(reloaded.tokenGeneration).toBe(first.tokenGeneration + 1)
    }
  })

  it('rolls the token release back when the registration that follows it fails', async () => {
    freshScope()
    const userUuid = randomUUID()
    const token = `token-${randomUUID()}`
    const holder = await reader.upsertOne(command({ userUuid, token }))

    const contested = randomUUID()
    const [a, b] = await Promise.all([
      settle(workerA.upsertOne(command({ userUuid, token, installationId: contested }))),
      settle(workerB.upsertOne(command({ userUuid, token, installationId: contested })))
    ])

    const winners = [a, b].filter(result => result.ok)
    expect(winners).toHaveLength(1)

    const active = await activeHoldersOf(token)
    expect(active).toHaveLength(1)
    expect(active[0].installationId).toBe(contested)
    expect(await reader.findOneActiveByUuid(holder.uuid)).toBeNull()
  })

  it('settles two users racing to claim the same installation on one owner', async () => {
    freshScope()
    const install = command()
    const userB = randomUUID()
    const userC = randomUUID()
    await reader.upsertOne(install)

    const [b, c] = await Promise.all([
      settle(workerA.upsertOne({ ...install, userUuid: userB })),
      settle(workerB.upsertOne({ ...install, userUuid: userC }))
    ])

    expect([b.ok, c.ok].filter(Boolean).length).toBeGreaterThanOrEqual(1)

    const rows = await setup.dataSource.manager.findBy(PushInstallation, {
      appScope,
      installationId: install.installationId
    })

    expect(rows).toHaveLength(1)
    expect([userB, userC]).toContain(rows[0].userUuid)
    expect(rows[0].revokedAt).toBeNull()
  })

  it('does not let a logout undo a login that already committed', async () => {
    freshScope()
    const userA = randomUUID()
    const userB = randomUUID()
    const install = command({ userUuid: userA })
    await reader.upsertOne(install)

    const [login, logout] = await Promise.all([
      settle(workerA.upsertOne({ ...install, userUuid: userB })),
      settle(workerB.detachUserForOwner(appScope, install.installationId, userA))
    ])

    expect(login.ok).toBe(true)
    expect(logout.ok).toBe(true)

    const reloaded = await reader.findOneByInstallationId(appScope, install.installationId)

    expect([userB, null]).toContain(reloaded?.userUuid)
    expect(reloaded?.revokedAt).toBeNull()
  })

  it('keeps one generation per token when a switch and a refresh overlap', async () => {
    freshScope()
    const userA = randomUUID()
    const userB = randomUUID()
    const install = command({ userUuid: userA })
    const original = await reader.upsertOne(install)
    const newToken = `token-${randomUUID()}`

    const [switched, refreshed] = await Promise.all([
      settle(workerA.upsertOne({ ...install, userUuid: userB })),
      settle(workerB.upsertOne({ ...install, token: newToken }))
    ])

    expect([switched.ok, refreshed.ok].filter(Boolean).length).toBeGreaterThanOrEqual(1)

    const reloaded = await setup.dataSource.manager.findOneByOrFail(PushInstallation, {
      uuid: original.uuid
    })

    const tokenChanged = reloaded.tokenHash === hashPushToken(newToken)
    expect(reloaded.tokenGeneration).toBe(original.tokenGeneration + (tokenChanged ? 1 : 0))
    expect(await activeHoldersOf(tokenChanged ? newToken : install.token)).toHaveLength(1)
  })
})
