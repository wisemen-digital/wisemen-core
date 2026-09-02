---
name: getting-started
description: Use when configuring Permify authorization checks or queued Permify schema and tuple writes in a NestJS API.
---

# @wisemen/nestjs-permify - Getting Started

Use this package to create and inject a configured Permify gRPC client, perform
context-aware permission checks, and process schema or tuple writes through
pg-boss jobs.

## Configure Permify Once

Register `PermifyModule.forRootAsync(...)` in a module that your application
can import wherever it needs authorization. Its factory returns the gRPC client
configuration and optional client interceptors. The configuration passed as
`client` must include the Permify endpoint and TLS settings.

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

Use the TLS values required by the deployed Permify endpoint; `insecure: true`
is suitable only for a non-TLS connection. `queueName` assigns the pg-boss
queue for schema and tuple write jobs.

## Perform Permission Checks

`Permify` reads the tenant and user from `PermifyContext`. Set that context at
the request boundary before invoking `Permify.check(...)`.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { PermifyContext } from '@wisemen/nestjs-permify'

@Injectable()
export class PermifyContextMiddleware implements NestMiddleware {
  constructor (private permifyContext: PermifyContext) {}

  use (_request: unknown, _response: unknown, next: () => void): void {
    this.permifyContext.run({
      tenantId: 't1',
      userId: 'user-123'
    }, next)
  }
}
```

Inject `Permify` into application services and check a permission against an
entity. Keep tenant and authenticated-user resolution in application code; this
package only carries those values through the request.

```ts
import { Injectable } from '@nestjs/common'
import { Permify } from '@wisemen/nestjs-permify'

@Injectable()
export class ViewDocumentUseCase {
  constructor (private permify: Permify) {}

  async execute (documentId: string): Promise<boolean> {
    return await this.permify.check('view', 'document', documentId)
  }
}
```

## Queue Schema And Tuple Writes

`PermifyQueueModule.forRootAsync(...)` intentionally requires the configured
`PermifyClient` in its factory result. Import the module that provides the
client, inject `PermifyClient`, and pass it through as `permifyClient`. This
keeps queue workers tied to the same Permify configuration as the API.

```ts
import { Module } from '@nestjs/common'
import {
  PermifyClient,
  PermifyQueueModule
} from '@wisemen/nestjs-permify'
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

Schedule `WritePermifyTuplesJob` for `client.data.write(...)` payloads and
`WritePermifySchemaJob` for `client.schema.write(...)` payloads. Use the
application's `PgBossScheduler` to schedule the job; do not call the Permify
client directly when the write should be handled asynchronously.

```ts
import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { WritePermifyTuplesJob } from '@wisemen/nestjs-permify'

@Injectable()
export class GrantDocumentAccessUseCase {
  constructor (private jobScheduler: PgBossScheduler) {}

  async execute (): Promise<void> {
    await this.jobScheduler.scheduleJob(new WritePermifyTuplesJob({
      tenantId: 't1',
      metadata: { schemaVersion: 'schema-version' },
      tuples: [],
      attributes: []
    }))
  }
}
```

The pg-boss worker must import the queue module so it discovers and executes
the registered job handlers.
