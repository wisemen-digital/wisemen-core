# @wisemen/nestjs-permify

NestJS integration for [Permify](https://permify.co/). It provides a configured
gRPC client, a request-scoped authorization context, a small permission-check
service, and pg-boss jobs for asynchronous schema and tuple writes.

## Install

```bash
pnpm add @wisemen/nestjs-permify @permify/permify-node
```

For queued writes, also configure `@wisemen/pgboss-nestjs-job` in the
application's worker and scheduler.

## Configure The Client

Register `PermifyModule` once and re-export it from an application module.

```ts
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  createPermifyAccessTokenInterceptor,
  PermifyModule
} from '@wisemen/nestjs-permify'

@Global()
@Module({
  imports: [
    PermifyModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        client: {
          endpoint: config.getOrThrow('PERMIFY_ENDPOINT'),
          insecure: true,
          cert: null,
          certChain: null,
          pk: null,
          interceptors: [
            createPermifyAccessTokenInterceptor(config.getOrThrow('PERMIFY_TOKEN'))
          ]
        },
        checkDepth: 20,
        queueName: 'permify'
      })
    })
  ],
  exports: [PermifyModule]
})
export class AppPermifyModule {}
```

Set `insecure`, `cert`, `certChain`, and `pk` for the TLS mode required by the
Permify endpoint. `checkDepth` defaults to `20`. `queueName` is the pg-boss
queue assigned to the schema and tuple write jobs.

## Check Permissions

Set the current tenant and user in `PermifyContext` at the request boundary,
then inject `Permify` into a service.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Permify, PermifyContext } from '@wisemen/nestjs-permify'

@Injectable()
export class PermifyContextMiddleware implements NestMiddleware {
  constructor (private permifyContext: PermifyContext) {}

  use (_request: unknown, _response: unknown, next: () => void): void {
    this.permifyContext.run({ tenantId: 't1', userId: 'user-123' }, next)
  }
}

@Injectable()
export class ViewDocumentUseCase {
  constructor (private permify: Permify) {}

  async execute (documentId: string): Promise<boolean> {
    return await this.permify.check('view', 'document', documentId)
  }
}
```

## Queue Writes

The queue module requires the exact configured `PermifyClient`. Import the
module that exports it, inject the client into the async factory, and return it.

```ts
import { Module } from '@nestjs/common'
import { PermifyClient, PermifyQueueModule } from '@wisemen/nestjs-permify'
import { AppPermifyModule } from './app-permify.module.js'

@Module({
  imports: [
    PermifyQueueModule.forRootAsync({
      imports: [AppPermifyModule],
      inject: [PermifyClient],
      useFactory: (permifyClient: PermifyClient) => ({
        permifyClient
      })
    })
  ]
})
export class AppPermifyQueueModule {}
```

Schedule the exported jobs through `PgBossScheduler`:

```ts
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import {
  WritePermifySchemaJob,
  WritePermifyTuplesJob
} from '@wisemen/nestjs-permify'

await jobScheduler.scheduleJob(new WritePermifySchemaJob({
  tenantId: 't1',
  schema: 'entity user {}'
}))

await jobScheduler.scheduleJob(new WritePermifyTuplesJob({
  tenantId: 't1',
  metadata: { schemaVersion: 'schema-version' },
  tuples: [],
  attributes: []
}))
```

`WritePermifySchemaJob` calls `client.schema.write(...)`; `WritePermifyTuplesJob`
calls `client.data.write(...)`. Import the queue module into the pg-boss worker
application so its handlers are discovered.
