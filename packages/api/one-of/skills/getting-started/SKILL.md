---
name: getting-started
description: Use when documenting discriminated NestJS API responses with Swagger.
---

# @wisemen/one-of - Getting Started

Use `@wisemen/one-of` when an API response has a shared shape with a `type`
discriminator and variant-specific `meta`.

## Define The Response Shape

```ts
import { ApiProperty } from '@nestjs/swagger'
import { OneOfMeta, OneOfMetaApiProperty, OneOfResponse, OneOfTypeApiProperty } from '@wisemen/one-of'

enum NotificationType {
  DRIVER_CREATED = 'driver.created',
  DRIVER_UPDATED = 'driver.updated',
}

class Notification {}

@OneOfResponse(Notification)
class NotificationResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @OneOfTypeApiProperty()
  type: NotificationType

  @OneOfMetaApiProperty()
  meta: unknown
}

@OneOfMeta(Notification, NotificationType.DRIVER_CREATED)
class DriverCreatedNotificationMeta {
  @ApiProperty({ type: String, format: 'uuid' })
  driverUuid: string
}

@OneOfMeta(Notification, NotificationType.DRIVER_UPDATED)
class DriverUpdatedNotificationMeta {
  @ApiProperty({ type: String, format: 'uuid' })
  driverUuid: string
}
```

Always pair `@OneOfResponse(...)` with both `@OneOfTypeApiProperty()` and
`@OneOfMetaApiProperty()`. Each `@OneOfMeta(...)` registers one allowed
discriminator value.

## Expose It In Swagger

Use `@OneOfApiResponse(...)` for direct controller responses:

```ts
import { Controller, Get } from '@nestjs/common'
import { OneOfApiResponse } from '@wisemen/one-of'

@Controller('/notifications')
class NotificationController {
  @Get()
  @OneOfApiResponse(Notification)
  async getNotification(): Promise<NotificationResponse> {
    throw new Error('not implemented')
  }
}
```

Use `@OneOfApiExtraModels(...)` and `@OneOfApiProperty(...)` when the one-of
response is nested inside another DTO:

```ts
import { OneOfApiExtraModels, OneOfApiProperty } from '@wisemen/one-of'

@OneOfApiExtraModels(Notification)
class GetNotificationsResponse {
  @OneOfApiProperty(Notification, { isArray: true })
  items: NotificationResponse[]
}
```
