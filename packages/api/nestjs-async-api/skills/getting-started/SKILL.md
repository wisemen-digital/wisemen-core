---
name: getting-started
description: >
  Define AsyncAPI channels with createChannel(), annotate message DTOs with @nestjs/swagger
  decorators, and generate AsyncAPI 3.0.0 YAML and HTML documentation.
type: lifecycle
library: nestjs-async-api
exports:
  - createChannel
  - generateAsyncApiYaml
  - generateAsyncAPIHTML
---

# @wisemen/nestjs-async-api — Getting Started

Generate AsyncAPI 3.0.0 specification documents from type-safe channel definitions and Swagger-decorated DTOs.

## When to Use

- Documenting NATS event channels with machine-readable AsyncAPI specs
- Generating HTML documentation for async messaging APIs
- Keeping message schema documentation in sync with TypeScript types

## Import

```ts
import { createChannel, generateAsyncApiYaml, generateAsyncAPIHTML } from '@wisemen/nestjs-async-api'
import type { AsyncAPIDefinition } from '@wisemen/nestjs-async-api'
```

## Quick Start

### 1. Define a message DTO with Swagger decorators

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

### 2. Define a channel

```ts
// src/events/user-created.integration.event.ts
import { createChannel } from '@wisemen/nestjs-async-api'

export const UserCreatedAddress = 'my-application-name.{env}.user.{userUuid}.created'
export const UserCreatedChannel = createChannel(UserCreatedAddress, {
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

Parameters in curly braces in the address are type-checked against the `parameters` object.

### 3. Generate YAML and HTML

```ts
// scripts/generate-async-api.ts
import { generateAsyncApiYaml, generateAsyncAPIHTML } from '@wisemen/nestjs-async-api'
import type { AsyncAPIDefinition } from '@wisemen/nestjs-async-api'
import { writeFileSync } from 'node:fs'

const definition: AsyncAPIDefinition = {
  asyncapi: '3.0.0',
  defaultContentType: 'application/json',
  info: {
    title: 'My Application Events',
    version: '1.0.0',
  },
  channels: './dist/src/**/*.integration.event.js'
}

const yaml = await generateAsyncApiYaml(definition)
writeFileSync('async-api.yaml', yaml)

const html = generateAsyncAPIHTML(yaml)
writeFileSync('async-api.html', html)
```

The `channels` field is a glob pattern. `generateAsyncApiYaml` dynamically imports matching files, finds exported channels via metadata, and generates JSON schemas from the Swagger-decorated message classes.

## Source Files

For full API details, read the source files.

- Channel factory: `lib/create-channel.ts`
- YAML generator: `lib/generate-async-api-yaml.ts`
- HTML generator: `lib/generate-async-api-html.ts`
- Type definitions: `lib/async-api-definition.types.ts`, `lib/async-api.types.ts`
