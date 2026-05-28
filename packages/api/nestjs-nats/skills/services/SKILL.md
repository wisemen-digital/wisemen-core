---
name: services
description: >
  Expose NATS microservices with @NatsService and @NatsServiceEndpoint for request-reply
  patterns with built-in service discovery and health monitoring.
type: feature
library: nestjs-nats
requires:
  - getting-started
exports:
  - NatsService
  - NatsServiceEndpoint
---

# @wisemen/nestjs-nats — Services

Expose request-reply endpoints over NATS with service discovery and health monitoring via the NATS services protocol.

## When to Use

- Building request-reply microservice endpoints over NATS
- Exposing services with built-in health monitoring and discovery
- Synchronous inter-service communication where the caller needs a response

**Use instead:** `@NatsSubscriber` for fire-and-forget messaging where no response is needed.

## Import

```ts
import {
  NatsService, NatsServiceEndpoint,
  OnNatsMessage, NatsMessageData, NatsMessage,
  NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
```

## Quick Start

### 1. Define a service

```ts
import { NatsService } from '@wisemen/nestjs-nats'
import { AppNatsConnection } from './app-nats-connection.js'

@NatsService((config) => ({
  connection: AppNatsConnection,
  name: 'user-service',
  version: '1.0.0',
  description: 'User management service',
}))
export class UserNatsService {}
```

### 2. Add endpoints

```ts
import {
  NatsServiceEndpoint, OnNatsMessage,
  NatsMessageData, NatsMessage, NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
import type { Msg } from '@nats-io/transport-node'
import { UserNatsService } from './user-nats.service.js'

@NatsServiceEndpoint((config) => ({
  service: UserNatsService,
  subject: 'users.get',
  name: 'get-user',
}))
export class GetUserEndpoint {
  constructor(private readonly userService: UserService) {}

  @OnNatsMessage()
  async handle(
    @NatsMessageData(NatsMsgDataJsonPipe) request: { userId: string },
    @NatsMessage() msg: Msg,
  ): Promise<void> {
    const user = await this.userService.findById(request.userId)

    msg.respond(
      new TextEncoder().encode(JSON.stringify(user)),
    )
  }
}
```

The service is automatically registered with NATS service discovery. Clients can send requests to the endpoint's subject and receive the response.

## Source Files

For full API details, read the source files.

- Service decorator: `lib/services/nats-service.decorator.ts`
- Service endpoint decorator: `lib/services/nats-service-endpoint.decorator.ts`
- Service manager: `lib/services/nats-service.ts`

## See Also

- [getting-started](../getting-started/SKILL.md) -- Set up NatsModule and connections
- [consumers](../consumers/SKILL.md) -- Durable message processing (fire-and-forget, not request-reply)
