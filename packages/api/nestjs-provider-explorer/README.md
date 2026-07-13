# @wisemen/nestjs-provider-explorer

Shared provider discovery utilities for NestJS packages.

This package provides:

- `ProvidersExplorerModule` to register the explorer with Nest
- `ProvidersExplorer` to enumerate discovered providers lazily
- `NestjsProvider` metadata containing `providerClass`, `providerInstance`, and
  the underlying Nest `instanceWrapper`

## Installation

```bash
pnpm add @wisemen/nestjs-provider-explorer
```

### Peer dependencies

```bash
pnpm add @nestjs/common @nestjs/core
```

## Register The Module

Import `ProvidersExplorerModule` into the module that needs provider discovery.
It wraps Nest's `DiscoveryModule`, so no extra discovery setup is required.

```ts
import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '@wisemen/nestjs-provider-explorer'
import { ProviderRegistry } from './provider.registry.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [ProviderRegistry]
})
export class ProviderRegistryModule {}
```

## Explore Providers

Inject `ProvidersExplorer`, then iterate over `providers` to inspect the
discovered classes and instances.

```ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ProvidersExplorer } from '@wisemen/nestjs-provider-explorer'

@Injectable()
export class ProviderRegistry implements OnApplicationBootstrap {
  constructor (
    private readonly providersExplorer: ProvidersExplorer
  ) {}

  onApplicationBootstrap (): void {
    for (const provider of this.providersExplorer.providers) {
      console.info(provider.providerClass.name)
    }
  }
}
```

Each `NestjsProvider` exposes:

- `providerClass`: the discovered provider metatype
- `providerInstance`: the instantiated provider object
- `instanceWrapper`: Nest's internal `InstanceWrapper`, useful when you need to
  resolve transient or request-scoped providers manually

## Filter Providers

The explorer returns all discovered class-based providers. Consumers are
expected to filter them with their own decorators or metadata checks.

```ts
import { Injectable } from '@nestjs/common'
import { ProvidersExplorer } from '@wisemen/nestjs-provider-explorer'
import { isTypesenseCollector } from './typesense-collector.decorator.js'

@Injectable()
export class TypesenseCollectors {
  constructor (
    private readonly providersExplorer: ProvidersExplorer
  ) {}

  collect (): void {
    for (const provider of this.providersExplorer.providers) {
      if (!isTypesenseCollector(provider.providerClass)) {
        continue
      }

      provider.providerInstance
    }
  }
}
```

## Scoped Providers

For singleton providers, use `providerInstance` directly. For transient or
request-scoped providers, inspect `instanceWrapper` and resolve through
`ModuleRef` when needed. This is the pattern used by packages that must defer
instantiation until runtime.
