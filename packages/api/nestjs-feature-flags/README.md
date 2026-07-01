# @wisemen/nestjs-feature-flags

Feature flags for NestJS applications backed by OpenFeature and Go Feature
Flag.

## Overview

This package provides:

- typed flag definitions via `createFlag(...)`
- NestJS module registration through `FeatureFlagModule`
- flag evaluation through `FeatureFlags`
- request-scoped evaluation context through `FeatureFlagContext`
- boolean route guards through `RequireFlag(...)`
- config synchronization through `FeatureFlags.synchronizeConfig(...)`
- test overrides through `FeatureFlagsStub`

## Define Flags

Define flags in exported `*.flag.ts` files so they can be discovered by the
module `flagsGlob`.

```ts
import { createFlag } from '@wisemen/nestjs-feature-flags'

export const SearchCollectionsFlag = createFlag({
  type: 'boolean',
  defaultValue: true,
  name: 'global_search'
})
```

```ts
import { createFlag } from '@wisemen/nestjs-feature-flags'
import { MailProvider } from '#src/modules/mail/enums/mail-provider.enum.js'

export const MailProviderFlag = createFlag({
  type: 'string',
  enum: MailProvider,
  defaultValue: MailProvider.SCALEWAY,
  name: 'mail_provider'
})
```

## Register The Module

Wrap the package module in a local app module so the rest of the application
imports a single feature-flag module.

```ts
import { join } from 'node:path'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  EvaluationType,
  FeatureFlagModule as FlagModule,
  type FeatureFlagModuleOptions
} from '@wisemen/nestjs-feature-flags'
import { SyncFeatureFlagConfigModule } from '#src/modules/feature-flag/use-cases/sync-feature-flag-config/sync-feature-flag-config.module.js'

@Global()
@Module({
  imports: [
    SyncFeatureFlagConfigModule,
    FlagModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): FeatureFlagModuleOptions => {
        const endpoint = cfg.get<string>('GO_FEATURE_FLAG_URI')?.trim()
        const flagsGlob = join(process.cwd(), 'dist', '**', '*.flag.js')

        if (endpoint === undefined) {
          return { flagsGlob }
        }

        return {
          flagsGlob,
          defaultProvider: {
            apiKey: cfg.get<string>('GO_FEATURE_FLAG_API_KEY')?.trim(),
            endpoint,
            evaluationType: EvaluationType.InProcess,
            flagChangePollingIntervalMs: 30_000
          }
        }
      }
    })
  ],
  exports: [FlagModule]
})
export class FeatureFlagModule {}
```

If `defaultProvider` is omitted, flag evaluation falls back to the default
values defined in code.

## Register The TypeORM Entity

If the application synchronizes flag config into the database, include
`FeatureFlagEntity` in the datasource entities.

```ts
import { FeatureFlagEntity } from '@wisemen/nestjs-feature-flags'

entities: ['dist/src/**/*.entity.js', FeatureFlagEntity]
```

## Set Request Context

Set the OpenFeature transaction context once in middleware, then evaluate flags
later without passing a context object around.

```ts
import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { FeatureFlagContext } from '@wisemen/nestjs-feature-flags'
import { AuthorizationResolver } from '#src/modules/auth/services/authorization-resolver.js'
import { AuthContext } from '#src/modules/auth/auth.context.js'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authContext: AuthContext,
    private flagContext: FeatureFlagContext,
    private authResolver: AuthorizationResolver
  ) {}

  async use(req: FastifyRequest, _res: FastifyReply, next: () => void): Promise<void> {
    const auth = await this.authResolver.fromAuthorization(req.headers.authorization)
    const cb = () => this.flagContext.run({ userUuid: auth.userUuid }, next)

    this.authContext.runWithAuthorization(auth, cb)
  }
}
```

## Evaluate Flags

After the middleware sets the context, inject `FeatureFlags` and call `get(...)`
directly.

```ts
import { ConfigService } from '@nestjs/config'
import { FeatureFlags } from '@wisemen/nestjs-feature-flags'
import { MailProvider } from '#src/modules/mail/enums/mail-provider.enum.js'
import { MailProviderFlag } from './mail-provider.flag.js'

export async function mailClientFactory(
  cfg: ConfigService,
  flags: FeatureFlags
): Promise<MailClient> {
  const provider = await flags.get(MailProviderFlag)

  switch (provider) {
    case MailProvider.SCALEWAY:
      return new ScalewayMailClient(cfg)
    case MailProvider.SEND_GRID:
      return new SendGridMailClient(cfg)
    default:
      exhaustiveCheck(provider)
  }
}
```

You can also pass an explicit evaluation context to `get(...)` when needed.

## Guard Controllers

```ts
import { Controller, Get } from '@nestjs/common'
import { RequireFlag } from '@wisemen/nestjs-feature-flags'
import { SearchCollectionsFlag } from './search-collections.flag.js'

@Controller('search-collections')
export class SearchCollectionsController {
  @Get()
  @RequireFlag(SearchCollectionsFlag)
  async index(): Promise<void> {}
}
```

`RequireFlag(...)` only accepts boolean flags.

## Synchronize Flag Config

Use `FeatureFlags.synchronizeConfig(...)` from an app use case or scheduled job
to upsert the registered flag definitions into the feature flag store.

```ts
import { Injectable } from '@nestjs/common'
import { FeatureFlags } from '@wisemen/nestjs-feature-flags'
import { DataSource } from 'typeorm'

@Injectable()
export class SyncFeatureFlagConfigUseCase {
  constructor(
    private dataSource: DataSource,
    private flags: FeatureFlags
  ) {}

  async execute(): Promise<void> {
    await this.flags.synchronizeConfig(this.dataSource)
  }
}
```

## Test Overrides

Create one `FeatureFlagsStub` from the Nest application container and expose it
through test setup.

```ts
import { FeatureFlags, FeatureFlagsStub } from '@wisemen/nestjs-feature-flags'

export class TestSetup {
  private flagsStub: FeatureFlagsStub

  private async initialize(): Promise<void> {
    const flags = this.app.get(FeatureFlags, { strict: false })
    this.flagsStub = new FeatureFlagsStub(flags)
  }

  get flags(): FeatureFlagsStub {
    return this.flagsStub
  }
}
```

```ts
setup.flags.mockFlag(SearchCollectionsFlag, true)
setup.flags.mockFlag(MailProviderFlag, MailProvider.SEND_GRID)
```
