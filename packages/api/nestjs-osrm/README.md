# @wisemen/nestjs-osrm

A configurable NestJS module for interacting with OSRM route and table
endpoints.

## Installation

```bash
pnpm add @wisemen/nestjs-osrm
```

## Usage

### Register the module

Wrap the shared OSRM client in a dedicated app module and configure it through
`forRootAsync(...)`.

```typescript
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

### Use the client

Inject `OsrmClient` and choose the route or table call that matches the use
case.

```typescript
import { Injectable } from '@nestjs/common'
import { Coordinates } from '@wisemen/coordinates'
import { OsrmClient } from '@wisemen/nestjs-osrm'

@Injectable()
export class RoutePlanner {
  constructor (private readonly osrm: OsrmClient) {}

  async calculateRoute (from: Coordinates, to: Coordinates) {
    return this.osrm.calculateRoute(from, to, {
      overview: 'full',
      geometries: 'geojson'
    })
  }

  async calculateTravelTimes (origin: Coordinates, destinations: Coordinates[]) {
    return this.osrm.calculateTile(origin, destinations)
  }
}
```

### Use the mock client

Tests can swap the transport at module level without changing consumers.

```typescript
import { Module } from '@nestjs/common'
import { OsrmModule } from '@wisemen/nestjs-osrm'

@Module({
  imports: [OsrmModule.forRoot({
    client: {
      type: 'mock',
      averageSpeedKph: 50
    }
  })],
  exports: [OsrmModule]
})
export class MockOsrmModule {}
```
