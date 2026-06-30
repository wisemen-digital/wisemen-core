---
name: getting-started
description: Feature flags for NestJS API applications backed by OpenFeature and Go Feature Flag. Use when defining, evaluating feature flags.
---

## Define Flags

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

Export flags from files matched by `flagsGlob`. By convention use `*.flag.ts`
filenames so they are easy to discover.

## Evaluate Flags In Application Code

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

## Stub Flags In Tests

Create one stub from the Nest app container and expose it through your test
setup so each test can override only the flags it cares about.

```ts
setup.flags.mockFlag(SearchCollectionsFlag, true)
setup.flags.mockFlag(MailProviderFlag, MailProvider.SEND_GRID)
```


## Set Request Context In Middleware

Set the feature-flag transaction context once in auth middleware, then evaluate
flags later without passing a context object around.

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