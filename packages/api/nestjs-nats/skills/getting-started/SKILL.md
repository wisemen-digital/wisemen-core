---
name: getting-started
description: >
  Register NatsModule, define a connection with @NatsConnection, create a JetStream
  stream with @NatsStream, and build a subscriber with @NatsSubscriber and @OnNatsMessage
  to receive messages.
type: lifecycle
library: nestjs-nats
exports:
  - NatsModule
  - NatsClientModule
  - NatsClient
  - NatsConnection
  - NatsStream
  - NatsSubscriber
  - OnNatsMessage
  - NatsMessageData
  - NatsMessage
  - NatsMessageSubject
  - NatsMsgDataJsonPipe
  - natsSubject
---

# @wisemen/nestjs-nats — Getting Started

NATS messaging for NestJS with decorator-driven subscribers, JetStream streams, and type-safe subject handling.

## When to Use

- Adding pub/sub messaging to a NestJS application via NATS
- Building event-driven microservices with JetStream durability
- Publishing fire-and-forget messages with NatsClient

**Use instead:** Direct `@nats-io/transport-node` when you don't need NestJS module integration or decorator-driven handlers.

## Import

```ts
import {
  NatsModule, NatsClientModule, NatsClient,
  NatsConnection, NatsStream, NatsSubscriber,
  OnNatsMessage, NatsMessageData, NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
```

## Quick Start

### 1. Define a connection

```ts
import { NatsConnection } from '@wisemen/nestjs-nats'
import type { ConfigService } from '@nestjs/config'

@NatsConnection((config: ConfigService) => ({
  name: 'default',
  servers: config.getOrThrow('NATS_ENDPOINT'),
}))
export class AppNatsConnection {}
```

### 2. Define a stream (optional, for JetStream)

```ts
import { NatsStream } from '@wisemen/nestjs-nats'
import { RetentionPolicy } from '@nats-io/jetstream'
import { nanos } from '@nats-io/transport-node'
import { AppNatsConnection } from './app-nats-connection.js'

@NatsStream((config) => ({
  connection: AppNatsConnection,
  name: 'orders',
  subjects: ['orders.>'],
  retention: RetentionPolicy.Limits,
  max_msgs: 100_000,
  max_bytes: 1_000_000_000,
  max_age: nanos(7 * 24 * 60 * 60 * 1000),
}))
export class OrdersStream {}
```

### 3. Create a subscriber

```ts
import {
  NatsSubscriber, OnNatsMessage,
  NatsMessageData, NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
import { AppNatsConnection } from './app-nats-connection.js'

@NatsSubscriber((config) => ({
  connection: AppNatsConnection,
  subject: 'orders.created',
}))
export class OrderCreatedSubscriber {
  @OnNatsMessage()
  async handle(
    @NatsMessageData(NatsMsgDataJsonPipe) data: unknown,
  ): Promise<void> {
    // data is the decoded JSON payload
  }
}
```

### 4. Register the module

```ts
import { Module } from '@nestjs/common'
import { NatsModule } from '@wisemen/nestjs-nats'
import { OrdersStream } from './orders.stream.js'

@Module({
  imports: [
    NatsModule.forRoot({
      modules: [OrderSubscriberModule],
      streams: [OrdersStream],
    }),
  ],
})
export class AppModule {}
```

### 5. Publish messages with NatsClient

```ts
import { NatsClientModule, NatsClient } from '@wisemen/nestjs-nats'

// Register NatsClientModule.forRootAsync in your module
@Injectable()
export class OrderService {
  constructor(private readonly nats: NatsClient) {}

  publishOrderCreated(order: Order): void {
    this.nats.publish(
      'orders.created',
      new TextEncoder().encode(JSON.stringify(order)),
    )
  }
}
```

## Source Files

For full API details, read the source files.

- Module: `lib/nats.module.ts`
- Client module: `lib/nats.client.module.ts`, `lib/nats.client.ts`
- Connection decorator: `lib/connections/nats-connection.decorator.ts`
- Stream decorator: `lib/streams/nats-stream.decorator.ts`
- Subscriber decorator: `lib/subscribers/nats-subscriber.decorator.ts`
- Message handler: `lib/message-handler/on-nats-message.decorator.ts`
- Parameter decorators: `lib/parameters/nats-message-data.decorator.ts`
- Pipes: `lib/parameters/pipes/`
- Subject builder: `lib/nats-subject.ts`

## See Also

- [consumers](../consumers/SKILL.md) -- JetStream durable consumers with at-least-once delivery
- [cloud-events](../cloud-events/SKILL.md) -- CloudEvents-spec messaging over NATS
- [services](../services/SKILL.md) -- Request-reply microservice endpoints
