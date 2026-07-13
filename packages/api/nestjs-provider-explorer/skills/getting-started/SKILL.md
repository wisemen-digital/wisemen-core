---
name: getting-started
description: Use when scanning NestJS providers with DiscoveryService-backed utilities.
---

# @wisemen/nestjs-provider-explorer - Getting Started

Use `ProvidersExplorerModule` when a NestJS package needs to discover all
registered class-based providers, then inject `ProvidersExplorer` and filter
its `providers` list with your own decorators or metadata predicates.

## Register The Module

Import `ProvidersExplorerModule` anywhere you need provider discovery. The
module wraps Nest's `DiscoveryModule` internally.

```ts
import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '@wisemen/nestjs-provider-explorer'
import { DecoratedProviderRegistry } from './decorated-provider.registry.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [DecoratedProviderRegistry],
  exports: [DecoratedProviderRegistry]
})
export class DecoratedProviderRegistryModule {}
```

## Explore Registered Providers

Inject `ProvidersExplorer` into a singleton service and iterate over
`providers` during bootstrap or lazy initialization.

```ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ProvidersExplorer } from '@wisemen/nestjs-provider-explorer'

@Injectable()
export class DecoratedProviderRegistry implements OnApplicationBootstrap {
  constructor (
    private providersExplorer: ProvidersExplorer
  ) {}

  onApplicationBootstrap (): void {
    for (const provider of this.providersExplorer.providers) {
      console.info(provider.providerClass.name)
    }
  }
}
```

The explorer only returns providers that have a class metatype and prototype,
which avoids factory-only and value-only registrations.

## Filter By Decorator Metadata

The intended pattern is to pair the explorer with custom decorators or metadata
guards, then register only the matching providers.

```ts
import { Injectable } from '@nestjs/common'
import { ProvidersExplorer } from '@wisemen/nestjs-provider-explorer'
import { getQueueName, isQueueHandler } from './queue-handler.decorator.js'

@Injectable()
export class QueueHandlerRegistry {
  constructor (
    private providersExplorer: ProvidersExplorer
  ) {}

  build (): Map<string, object> {
    const handlers = new Map<string, object>()

    for (const provider of this.providersExplorer.providers) {
      if (!isQueueHandler(provider.providerClass)) {
        continue
      }

      handlers.set(
        getQueueName(provider.providerClass),
        provider.providerInstance
      )
    }

    return handlers
  }
}
```

## Handle Scoped Providers

Each discovered item includes:

- `providerClass`: the class metatype
- `providerInstance`: the instantiated object
- `instanceWrapper`: Nest's `InstanceWrapper`

Use `providerInstance` for singleton providers. When you must support transient
or request-scoped providers, inspect `instanceWrapper` and resolve via
`ModuleRef` instead of caching the instance directly.
