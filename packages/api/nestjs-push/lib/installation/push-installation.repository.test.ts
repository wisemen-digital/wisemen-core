import { randomBytes, randomUUID } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { PostgresTestSetup } from '@wisemen/nestjs-tests/postgres'
import { SnakeNamingStrategy } from '@wisemen/nestjs-typeorm'
import type { DataSourceOptions, NamingStrategyInterface } from 'typeorm'
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
 * Run the repository contract with both supported naming strategies to verify that its explicit
 * column names produce the same schema.
 */
for (const [label, namingStrategy] of [
  ['default naming strategy', undefined],
  ['snake naming strategy', new SnakeNamingStrategy()]
] as Array<[string, NamingStrategyInterface | undefined]>) {
  describe(`PushInstallationRepository (${label})`, () => {
    let setup: PostgresTestSetup
    let repository: PushInstallationRepository
    let appScope: string

    before(async () => {
      setup = await PostgresTestSetup.create({
        dataSourceOptions,
        entities: [PushInstallation],
        packageName: `nestjs-push-${namingStrategy === undefined ? 'default' : 'snake'}`,
        namingStrategy
      })
      repository = new PushInstallationRepository(setup.dataSource.manager)
    })

    after(async () => {
      await setup.teardown()
    })

    function command (overrides: Partial<{
      appScope: string
      installationId: string
      installationSecret: string
      userUuid: string
      token: string
      platform: PushPlatform
      appVersion: string | null
    }> = {}) {
      return {
        appScope: overrides.appScope ?? appScope,
        installationId: overrides.installationId ?? randomUUID(),
        installationSecret: overrides.installationSecret ?? randomBytes(32).toString('hex'),
        userUuid: overrides.userUuid ?? randomUUID(),
        token: overrides.token ?? `token-${randomUUID()}`,
        platform: overrides.platform ?? PushPlatform.ANDROID,
        appVersion: overrides.appVersion ?? null
      }
    }

    function freshScope (): void {
      appScope = `scope-${randomUUID()}`
    }

    describe('physical schema', () => {
      it('keeps camel-case column names under this naming strategy', () => {
        const metadata = setup.dataSource.getMetadata(PushInstallation)
        const columns = metadata.columns.map(column => column.databaseName)

        expect(metadata.tableName).toBe('push_installation')
        expect(columns).toContain('tokenGeneration')
        expect(columns).toContain('installationId')
        expect(columns).toContain('installationSecretHash')
        expect(columns).toContain('appScope')
        expect(columns).toContain('revokedAt')
        expect(columns).not.toContain('token_generation')
        expect(columns).not.toContain('installation_secret_hash')
      })

      it('allows an installation to exist with no associated user', () => {
        const metadata = setup.dataSource.getMetadata(PushInstallation)

        expect(metadata.findColumnWithDatabaseName('userUuid')?.isNullable).toBe(true)
      })
    })

    describe('registration', () => {
      it('stores a hashed token and never the raw token in the hash column', async () => {
        freshScope()
        const input = command()

        const installation = await repository.upsertOne(input)

        expect(installation.tokenHash).toBe(hashPushToken(input.token))
        expect(installation.tokenHash).not.toBe(input.token)
        expect(installation.tokenGeneration).toBe(1)
        expect(installation.revokedAt).toBeNull()
      })

      it('treats an unchanged token as a heartbeat without bumping the generation', async () => {
        freshScope()
        const input = command()
        const first = await repository.upsertOne(input)

        const second = await repository.upsertOne({ ...input, appVersion: '1.2.3' })

        expect(second.uuid).toBe(first.uuid)
        expect(second.tokenGeneration).toBe(first.tokenGeneration)
        expect(second.appVersion).toBe('1.2.3')
      })

      it('bumps the generation when the token changes', async () => {
        freshScope()
        const input = command()
        const first = await repository.upsertOne(input)

        const refreshed = await repository.upsertOne({ ...input, token: `token-${randomUUID()}` })

        expect(refreshed.uuid).toBe(first.uuid)
        expect(refreshed.tokenGeneration).toBe(first.tokenGeneration + 1)
      })

      it('supports several installations for one user', async () => {
        freshScope()
        const userUuid = randomUUID()

        const phone = await repository.upsertOne(command({ userUuid }))
        const tablet = await repository.upsertOne(command({ userUuid }))

        expect(phone.uuid).not.toBe(tablet.uuid)
        expect(await repository.findManyActiveForUsers(appScope, [userUuid])).toHaveLength(2)
      })

      it('moves a token to a new installation of the same user and revokes the old one',
        async () => {
          freshScope()
          const userUuid = randomUUID()
          const token = `token-${randomUUID()}`
          const original = await repository.upsertOne(command({ userUuid, token }))

          const reinstalled = await repository.upsertOne(command({ userUuid, token }))

          expect(reinstalled.uuid).not.toBe(original.uuid)
          expect((await repository.findOneActiveByUuid(original.uuid))).toBeNull()
          expect(await repository.findManyActiveForUsers(appScope, [userUuid]))
            .toHaveLength(1)
        })

      it('reactivates a revoked installation and bumps its generation', async () => {
        freshScope()
        const input = command()
        const first = await repository.upsertOne(input)
        await repository.revokeOneForOwner(
          appScope,
          input.installationId,
          input.userUuid,
          'device_removed'
        )

        const reactivated = await repository.upsertOne(input)

        expect(reactivated.uuid).toBe(first.uuid)
        expect(reactivated.revokedAt).toBeNull()
        expect(reactivated.tokenGeneration).toBe(first.tokenGeneration + 1)
      })

      it('never returns the stored possession proof', async () => {
        freshScope()
        const input = command()

        const installation = await repository.upsertOne(input)

        expect(installation.installationSecretHash).toBeUndefined()
        expect(JSON.stringify(installation)).not.toContain(input.installationSecret)
      })
    })

    describe('user association', () => {
      it('runs the whole install, login, logout, login lifecycle on one row', async () => {
        freshScope()
        const userA = randomUUID()
        const userB = randomUUID()
        const install = command({ userUuid: userA })

        const registered = await repository.upsertOne(install)
        expect(registered.userUuid).toBe(userA)

        const detached = await repository.detachUserForOwner(
          appScope, install.installationId, userA
        )
        expect(detached).toBe(true)

        const unowned = await repository.findOneByInstallationId(appScope, install.installationId)
        expect(unowned?.uuid).toBe(registered.uuid)
        expect(unowned?.userUuid).toBeNull()
        expect(unowned?.revokedAt).toBeNull()
        expect(unowned?.token).toBe(install.token)

        const claimed = await repository.upsertOne({
          ...install,
          userUuid: userB,
          token: `token-${randomUUID()}`
        })

        expect(claimed.uuid).toBe(registered.uuid)
        expect(claimed.installationId).toBe(install.installationId)
        expect(claimed.userUuid).toBe(userB)
        expect(claimed.tokenGeneration).toBe(registered.tokenGeneration + 1)
      })

      it('lets the next user claim an installation whose logout never arrived', async () => {
        freshScope()
        const userA = randomUUID()
        const userB = randomUUID()
        const install = command({ userUuid: userA })
        const original = await repository.upsertOne(install)

        const claimed = await repository.upsertOne({
          ...install,
          userUuid: userB,
          token: `token-${randomUUID()}`
        })

        expect(claimed.uuid).toBe(original.uuid)
        expect(claimed.userUuid).toBe(userB)
      })

      it('refuses a claim that cannot prove possession of the installation', async () => {
        freshScope()
        const install = command()
        await repository.upsertOne(install)

        await expect(repository.upsertOne({
          ...install,
          installationSecret: randomBytes(32).toString('hex'),
          userUuid: randomUUID(),
          token: `token-${randomUUID()}`
        })).rejects.toThrow(PushInstallationConflictError)
      })

      it('refuses a claim with no possession proof at all', async () => {
        freshScope()
        const install = command()
        await repository.upsertOne(install)

        await expect(repository.upsertOne({ ...install, installationSecret: '' }))
          .rejects.toThrow(PushInstallationConflictError)
      })

      it('leaves the registration untouched when possession proof fails', async () => {
        freshScope()
        const userA = randomUUID()
        const install = command({ userUuid: userA })
        const original = await repository.upsertOne(install)

        await expect(repository.upsertOne({
          ...install,
          installationSecret: randomBytes(32).toString('hex'),
          userUuid: randomUUID(),
          token: `token-${randomUUID()}`
        })).rejects.toThrow(PushInstallationConflictError)

        const reloaded = await repository.findOneActiveByUuid(original.uuid)
        expect(reloaded?.userUuid).toBe(userA)
        expect(reloaded?.token).toBe(install.token)
        expect(reloaded?.tokenGeneration).toBe(original.tokenGeneration)
      })

      it('refuses to claim a detached installation without its secret', async () => {
        freshScope()
        const userA = randomUUID()
        const install = command({ userUuid: userA })
        await repository.upsertOne(install)
        await repository.detachUserForOwner(appScope, install.installationId, userA)

        await expect(repository.upsertOne({
          ...install,
          installationSecret: randomBytes(32).toString('hex'),
          userUuid: randomUUID()
        })).rejects.toThrow(PushInstallationConflictError)
      })

      it('does not touch the token generation when only the user changes', async () => {
        freshScope()
        const userA = randomUUID()
        const install = command({ userUuid: userA })
        const original = await repository.upsertOne(install)
        await repository.detachUserForOwner(appScope, install.installationId, userA)

        const claimed = await repository.upsertOne({ ...install, userUuid: randomUUID() })

        expect(claimed.uuid).toBe(original.uuid)
        expect(claimed.tokenGeneration).toBe(original.tokenGeneration)
      })

      it('keeps the same secret across an ownership change', async () => {
        freshScope()
        const userA = randomUUID()
        const userB = randomUUID()
        const install = command({ userUuid: userA })
        await repository.upsertOne(install)

        await repository.upsertOne({ ...install, userUuid: userB })

        const backToA = await repository.upsertOne({ ...install, userUuid: userA })
        expect(backToA.userUuid).toBe(userA)
      })

      it('refuses to claim a token held by another account', async () => {
        freshScope()
        const token = `token-${randomUUID()}`
        await repository.upsertOne(command({ token }))

        await expect(repository.upsertOne(command({ token })))
          .rejects.toThrow(PushInstallationConflictError)
      })

      it('leaves the existing registration untouched when a claim is rejected', async () => {
        freshScope()
        const token = `token-${randomUUID()}`
        const owner = command({ token })
        const original = await repository.upsertOne(owner)

        await expect(repository.upsertOne(command({ token })))
          .rejects.toThrow(PushInstallationConflictError)

        const reloaded = await repository.findOneActiveByUuid(original.uuid)
        expect(reloaded).not.toBeNull()
        expect(reloaded?.tokenGeneration).toBe(original.tokenGeneration)
        expect(reloaded?.userUuid).toBe(owner.userUuid)
      })

      it('isolates installations by app scope', async () => {
        freshScope()
        const otherScope = `scope-${randomUUID()}`
        const userUuid = randomUUID()
        const token = `token-${randomUUID()}`
        await repository.upsertOne(command({ userUuid, token }))

        await repository.upsertOne(command({ appScope: otherScope, userUuid, token }))

        expect(await repository.findManyActiveForUsers(appScope, [userUuid])).toHaveLength(1)
        expect(await repository.findManyActiveForUsers(otherScope, [userUuid])).toHaveLength(1)
      })
    })

    describe('detach', () => {
      it('detaches only the current owner and is idempotent', async () => {
        freshScope()
        const input = command()
        await repository.upsertOne(input)

        const first = await repository.detachUserForOwner(
          appScope, input.installationId, input.userUuid
        )
        const second = await repository.detachUserForOwner(
          appScope, input.installationId, input.userUuid
        )

        expect(first).toBe(true)
        expect(second).toBe(false)
      })

      it('cannot detach an installation belonging to someone else', async () => {
        freshScope()
        const input = command()
        await repository.upsertOne(input)

        const detached = await repository.detachUserForOwner(
          appScope, input.installationId, randomUUID()
        )

        expect(detached).toBe(false)

        const reloaded = await repository.findOneByInstallationId(appScope, input.installationId)
        expect(reloaded?.userUuid).toBe(input.userUuid)
      })

      it('leaves the registration valid and its token in place', async () => {
        freshScope()
        const input = command()
        const registered = await repository.upsertOne(input)

        await repository.detachUserForOwner(appScope, input.installationId, input.userUuid)

        const reloaded = await repository.findOneActiveByUuid(registered.uuid)
        expect(reloaded).not.toBeNull()
        expect(reloaded?.revokedAt).toBeNull()
        expect(reloaded?.tokenHash).toBe(hashPushToken(input.token))
        expect(reloaded?.tokenGeneration).toBe(registered.tokenGeneration)
      })

      it('removes the installation from every user-targeted send', async () => {
        freshScope()
        const userA = randomUUID()
        const userB = randomUUID()
        const input = command({ userUuid: userA })
        await repository.upsertOne(input)

        await repository.detachUserForOwner(appScope, input.installationId, userA)
        expect(await repository.findManyActiveForUsers(appScope, [userA])).toEqual([])

        await repository.upsertOne({ ...input, userUuid: userB })
        expect(await repository.findManyActiveForUsers(appScope, [userA])).toEqual([])
        expect(await repository.findManyActiveForUsers(appScope, [userB])).toHaveLength(1)
      })
    })

    describe('revocation', () => {
      it('revokes only the caller own installation and is idempotent', async () => {
        freshScope()
        const input = command()
        await repository.upsertOne(input)

        const first = await repository.revokeOneForOwner(
          appScope, input.installationId, input.userUuid, 'device_removed'
        )
        const second = await repository.revokeOneForOwner(
          appScope, input.installationId, input.userUuid, 'device_removed'
        )

        expect(first).toBe(true)
        expect(second).toBe(false)
      })

      it('does not reveal another account installation', async () => {
        freshScope()
        const input = command()
        const installation = await repository.upsertOne(input)

        const revoked = await repository.revokeOneForOwner(
          appScope, input.installationId, randomUUID(), 'device_removed'
        )

        expect(revoked).toBe(false)
        expect(await repository.findOneActiveByUuid(installation.uuid)).not.toBeNull()
      })

      it('revokes only the generation that was actually sent', async () => {
        freshScope()
        const input = command()
        const first = await repository.upsertOne(input)
        const refreshed = await repository.upsertOne({
          ...input,
          token: `token-${randomUUID()}`
        })

        const stale = await repository.revokeOneIfGenerationMatches(
          refreshed.uuid, first.tokenGeneration, 'unregistered'
        )
        expect(stale).toBe(false)
        expect(await repository.findOneActiveByUuid(refreshed.uuid)).not.toBeNull()

        const current = await repository.revokeOneIfGenerationMatches(
          refreshed.uuid, refreshed.tokenGeneration, 'unregistered'
        )
        expect(current).toBe(true)
        expect(await repository.findOneActiveByUuid(refreshed.uuid)).toBeNull()
      })

      it('excludes revoked installations from send targets', async () => {
        freshScope()
        const input = command()
        await repository.upsertOne(input)
        await repository.revokeOneForOwner(
          appScope, input.installationId, input.userUuid, 'unregistered'
        )

        expect(await repository.findManyActiveForUsers(appScope, [input.userUuid])).toEqual([])
      })

      it('frees a revoked token for a later installation', async () => {
        freshScope()
        const token = `token-${randomUUID()}`
        const input = command({ token })
        await repository.upsertOne(input)
        await repository.revokeOneForOwner(
          appScope, input.installationId, input.userUuid, 'device_removed'
        )

        const claimed = await repository.upsertOne(command({ token }))

        expect(claimed.tokenHash).toBe(hashPushToken(token))
        expect(claimed.revokedAt).toBeNull()
      })
    })

    describe('lookup', () => {
      it('returns no targets for an empty user list without querying', async () => {
        freshScope()
        expect(await repository.findManyActiveForUsers(appScope, [])).toEqual([])
      })

      it('finds an installation by its client installation id', async () => {
        freshScope()
        const input = command()
        const created = await repository.upsertOne(input)

        const found = await repository.findOneByInstallationId(appScope, input.installationId)

        expect(found?.uuid).toBe(created.uuid)
      })
    })
  })
}
