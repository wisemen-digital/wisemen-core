---
name: getting-started
description: Use when registering push installations or sending push notifications in NestJS APIs with @wisemen/nestjs-push.
---

# @wisemen/nestjs-push - Getting Started

The root export is provider-neutral: message contracts, the `PUSH_PROVIDER`
token, and a durable installation registry. Firebase lives behind the `./fcm`
subpath, so an application that never imports it does not need `firebase-admin`
installed at all.

## Register an installation

`PushInstallationModule` registers and exports `PushInstallationRepository`.

The client generates two values once per app install and keeps both across
logins: `installationId`, its stable identity, and `installationSecret`, a
high-entropy secret held in secure device storage. It sends both on every
registration, plus whatever FCM token it currently has.

```ts
import { PushInstallationRepository, PushPlatform } from '@wisemen/nestjs-push'

@Injectable()
export class UpsertMyPushInstallationUseCase {
  constructor(private readonly installations: PushInstallationRepository) {}

  async execute(
    userUuid: string,
    installationId: string,
    installationSecret: string,
    token: string
  ): Promise<void> {
    await this.installations.upsertOne({
      appScope: this.config.firebaseProjectId,
      installationId,
      installationSecret,
      userUuid,
      token,
      platform: PushPlatform.ANDROID,
      appVersion: null
    })
  }
}
```

Take `userUuid` from the authenticated session, never from the request body.

An unchanged token is an idempotent heartbeat. A changed token increments
`tokenGeneration` in SQL; changing the associated user does not. A registration
whose secret does not match throws `PushInstallationConflictError` and leaves
the existing row untouched. Never log or return the raw token or the raw secret,
and never return the stored hash — the column is `select: false` so it is not
loaded in the first place.

Revoking an invalid token requires the generation that was sent
(`revokeOneIfGenerationMatches`), so a late provider result cannot kill a token
that has since been refreshed.

## Log a user out

Logout detaches the user; it does not invalidate the registration.

```ts
await this.installations.detachUserForOwner(appScope, installationId, userUuid)
```

The installation keeps its id, secret and token and stays valid, but has no user
and so is returned by no user-targeted send. It is conditional on the current
owner, so one user can never detach another's installation.

The next user of the same app install registers with the same `installationId`
and `installationSecret`, and the installation moves to them — the same row,
no conflict, even if this logout request never reached the server.

Use `revokeOneForOwner` only for permanent device removal. Both it and a
confirmed recipient error set `revokedAt`, which means the registration is no
longer a valid delivery address. That is a different thing from being logged
out, and the two must not be conflated.

On account switching the client should also delete its FCM token and clear
already-displayed notifications: a message FCM has accepted cannot be recalled,
and this adapter sends visible notifications, so the OS may display a title and
body before app code runs. See the README's account-switch privacy section —
client-side filtering on a recipient field in `data` does **not** close that
window.

## Send through FCM

Import the adapter only from `./fcm`, and only in an application that installs
`firebase-admin`. Credentials come from Application Default Credentials; never
pass service-account JSON through module options.

```ts
import { FcmPushModule } from '@wisemen/nestjs-push/fcm'

@Module({
  imports: [
    FcmPushModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        appName: config.getOrThrow('FIREBASE_APP_NAME'),
        projectId: config.getOrThrow('FIREBASE_PROJECT_ID')
      })
    })
  ]
})
export class DefaultPushModule {}
```

`FcmPushModule` binds `PUSH_PROVIDER` to its singleton provider. Inject that
token rather than the concrete class, so tests can substitute a fake. The
Firebase app is created lazily and deleted on module destroy.

## Test without Firebase

`@wisemen/nestjs-push/testing` imports no Firebase symbol, so it works in an
application that has not installed the peer.

```ts
import { PUSH_PROVIDER } from '@wisemen/nestjs-push'
import { FakePushProvider } from '@wisemen/nestjs-push/testing'

const provider = new FakePushProvider()
provider.program(installationUuid, { status: 'accepted', messageId: 'm-1' })

const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
  .overrideProvider(PUSH_PROVIDER).useValue(provider)
  .compile()

expect(provider.calls).toHaveLength(1)
```

`failNextCall` simulates a whole-call failure and `reset` clears state between
tests. Use `@wisemen/nestjs-push/fcm/testing` only when you need the SDK-typed
gateway fake to exercise Firebase error mapping; it requires the peer. Override
`FirebaseMessagingGatewayPort` from `@wisemen/nestjs-push/fcm` with
`FakeFirebaseMessagingGateway` from `@wisemen/nestjs-push/fcm/testing`.
`FirebaseMessagingGateway` is the production SDK implementation.

## Consumer responsibilities

Register `PushInstallation` in your root datasource metadata explicitly — the
usual `dist/**/*.entity.js` glob does not reach `node_modules`. Create the table
from the DDL in the README; the package never runs migrations and never calls
`synchronize`. It requires TypeORM 1.x, matching `@wisemen/nestjs-typeorm`.
