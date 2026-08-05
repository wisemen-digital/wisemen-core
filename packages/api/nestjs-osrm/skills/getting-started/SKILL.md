---
name: getting-started
description: Use when configuring a shared OSRM client in NestJS APIs.
---

# @wisemen/nestjs-osrm - Getting Started

Use `OsrmModule.forRootAsync(...)` to register a shared OSRM client and inject
`OsrmClient` anywhere the application needs route or table calculations.

## Register The Module

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OsrmModule } from '@wisemen/nestjs-osrm'

@Module({
  imports: [OsrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      client: {
        type: 'service',
        url: config.getOrThrow('OSRM_URL')
      }
    })
  })],
  exports: [OsrmModule]
})
export class DefaultOsrmModule {}
```

## Use The Client

`calculateRoute(...)` returns the first route, `calculateMultiLegRoute(...)`
returns the full OSRM route response, and `calculateTable(...)` /
`calculateTile(...)` wrap the table endpoint.

```ts
import { Injectable } from '@nestjs/common'
import { OsrmClient } from '@wisemen/nestjs-osrm'

@Injectable()
export class ExampleService {
  constructor (private readonly osrm: OsrmClient) {}

  async travelTimeBetween (from: Coordinates, to: Coordinates) {
    const route = await this.osrm.calculateRoute(from, to, {
      overview: false,
      annotations: ['distance']
    })

    return route.duration
  }
}
```

## Mock The Client

Switch the module to `type: 'mock'` in test wiring to keep the same injection
surface without calling a live OSRM instance.
