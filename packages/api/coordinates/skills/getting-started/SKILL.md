---
name: getting-started
description: Use when working with geographic coordinates in apis.
---

# @wisemen/coordinates - Getting Started

Use `Coordinates` as the shared type for geographic coordinates. Use
`CoordinatesCommand` in request DTOs, `CoordinatesQuery` for query parameters,
`@CoordinatesColumn()` in TypeORM entities, and `CoordinatesResponse` in API
responses.

```ts
import { ApiProperty } from '@nestjs/swagger'
import {
  Coordinates,
  CoordinatesColumn,
  CoordinatesCommand,
  CoordinatesQuery,
  CoordinatesResponse,
} from '@wisemen/coordinates'

export class UpdateLocationDto {
  @ApiProperty({ type: CoordinatesCommand })
  coordinates: CoordinatesCommand
}

export class LocationResponse {
  @ApiProperty({ type: CoordinatesResponse, nullable: true })
  coordinates: CoordinatesResponse | null
}

@Entity()
export class Location {
  @CoordinatesColumn({ nullable: true })
  coordinates: Coordinates | null
}

const coordinates = dto.coordinates.parse()
const center = query.parse()

return {
  coordinates: CoordinatesResponse.from(location.coordinates),
}
```
