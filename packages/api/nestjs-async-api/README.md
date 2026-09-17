# @wisemen/nestjs-async-api

A TypeScript package for generating AsyncAPI v3.0.0 documentation for NestJS applications. Automatically generate YAML specifications and HTML documentation for your asynchronous APIs (WebSockets, message queues, event-driven architectures).

## Features

- **AsyncAPI v3.0.0 Types**: Complete TypeScript type definitions for AsyncAPI specification
- **Channel Definitions**: Type-safe channel definitions with parameter extraction
- **YAML Generation**: Automatically generate AsyncAPI YAML specifications from your code
- **HTML Documentation**: Generate standalone HTML with property types, required status, descriptions, schemas and examples
- **NestJS Integration**: Seamlessly integrates with NestJS decorators and DTOs
- **Schema Generation**: Automatic schema generation from TypeScript classes using NestJS Swagger decorators

## Installation

```bash
npm install @wisemen/nestjs-async-api
```

## Usage

### Define a Channel

Create channels using the `createChannel` function with type-safe address parameters:

```typescript
import { createChannel } from '@wisemen/nestjs-async-api'

export const userNotificationsChannel = createChannel(
  'users.{userId}.notifications',
  {
    parameters: {
      userId: {
        description: 'The ID of the user receiving notifications'
      }
    },
    operations: {
      subscribe: {
        action: 'receive',
        summary: 'Subscribe to user notifications',
        description: 'Receive real-time notifications for a specific user',
        messages: [
            UserNotificationEvent // a DTO decorated with @nestjs/swagger properties
        ]
      }
    }
  }
)
```

### Define Your AsyncAPI Specification

Create an AsyncAPI definition that points to your channel files:

```typescript
import { AsyncAPIDefinition } from '@wisemen/nestjs-async-api'

export const asyncApiDefinition: AsyncAPIDefinition = {
  asyncapi: '3.0.0',
  defaultContentType: 'application/json',
  info: {
    title: 'My Application API',
    version: '1.0.0',
    description: 'Real-time event API for My Application',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  channels: 'src/**/*.channel.ts'  // Glob pattern to find channel files
}
```

### Generate YAML Documentation

Generate AsyncAPI YAML specification from your definitions:

```typescript
import { generateAsyncApiYaml } from '@wisemen/nestjs-async-api'
import { asyncApiDefinition } from './async-api.definition'

const yaml = await generateAsyncApiYaml(asyncApiDefinition)
console.log(yaml)
```

### Generate HTML Documentation

Generate beautiful HTML documentation from your YAML specification:

```typescript
import { generateAsyncAPIHTML } from '@wisemen/nestjs-async-api'

const html = generateAsyncAPIHTML(yaml)
// Write the returned HTML string to your documentation output file.
```

## Integration with NestJS

This package works seamlessly with NestJS decorators from `@nestjs/swagger`. Use `@ApiProperty()` decorators on your DTOs, and they will be automatically converted to AsyncAPI schemas:

```typescript
import { ApiProperty } from '@nestjs/swagger'

export class UserNotificationEvent {
  @ApiProperty({ description: 'Notification ID' })
  id: string

  @ApiProperty({ description: 'Notification message' })
  message: string

  @ApiProperty({ description: 'Timestamp', type: Date })
  timestamp: Date
}
```

## Nullable properties

Use Swagger's `nullable: true` together with an explicit type:

```typescript
@ApiProperty({ type: String, format: 'uuid', nullable: true })
currentTestExerciseUuid: string | null
```

The YAML generator converts this to `type: [string, 'null']`, as required by
AsyncAPI's JSON Schema format. Nullable enums, references and composed schemas
use an `anyOf` union with `{ type: 'null' }` so their other constraints remain intact.
Nested properties and array items are converted too.

HTML property tables display nullable types as `string (uuid) | null` alongside
the required status and description. Required and nullable are independent: a
required nullable property must be present, but its value can be `null`.
Expandable schemas expose nested definitions and constraints. Existing YAML
using Swagger's `nullable` keyword is also supported by the HTML renderer.

## License

GPL
