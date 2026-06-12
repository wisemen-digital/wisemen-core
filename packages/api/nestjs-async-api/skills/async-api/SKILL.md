---
name: async-api
description: Create documentation for NATS cloud events. Use this when creating a NATS event that gets broadcasted to a place outside of the API it was created (e.g. integration events, websocket events).
---

Generate AsyncAPI 3.0.0 specification documents from type-safe channel definitions and Swagger-decorated DTOs.

# Validate event structure
- Make sure the properties of the event are decorated using '@nestjs/swagger'. 

eg.
```ts
// src/events/user-created.integration.event.ts
import { ApiProperty } from '@nestjs/swagger'

export class UserCreatedEventContent {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: UserUuid

  @UserTypeApiProperty()
  type: UserType

  constructor (uuid: UserUuid, type: UserType) {
    this.uuid = uuid
    this.type = type
  }
}

export class UserCreatedIntegrationEvent extends IntegrationEvent {
  @ApiProperty({
    enumName: 'UserCreatedEventType',
    enum: [IntegrationEventType.USER_CREATED],
  })
  declare type: IntegrationEventType.USER_CREATED

  @ApiProperty({ type: UserCreatedEventContent })
  declare data: UserCreatedEventContent

  constructor (uuid: UserUuid, type: UserType) {
    super({
      type: IntegrationEventType.USER_CREATED,
      data: new UserCreatedEventContent(uuid, type),
      version: '0.0.1'
    })
  }
}
```

# Define a channel
- This happens in the same file as the event definition, at the bottom of the file.
- Make a separate constant containing the subject of the event.
  - The subject may contain parameters like 'environment', 'uuid', ... These parameters must be enclosed by curly brackets (`{}`)
- Create a channel using the `createChannel` method from the '@wisemen/nestjs-async-api' package.
  - All parameters defined in the subject must be documented in the channel config param of the method.
  - Define operations for the event. These can be 'send' or 'receive'
  

eg.
```ts
// src/events/user-created.integration.event.ts
import { createChannel } from '@wisemen/nestjs-async-api'

export const UserCreatedSubject = 'my-application-name.{env}.user.{userUuid}.created'
export const UserCreatedChannel = createChannel(UserCreatedSubject, {
  parameters: {
    env: {
      enum: Object.values(EnvType),
      description: 'The environment from which the event originates',
      examples: [EnvType.DEVELOPMENT]
    },
    userUuid: {
      description: 'The uuid of the user'
    }
  },
  operations: {
    sendUserCreated: {
      action: 'send',
      summary: 'this message is sent when an user is created',
      messages: [UserCreatedIntegrationEvent],
    },
  }
})
```