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
import { nkeyAuthenticator } from '@nats-io/transport-node'

@NatsConnection((config) => ({
  name: 'default',
  servers: config.getOrThrow('NATS_ENDPOINT'),
  authenticator: nkeyAuthenticator(new TextEncoder().encode(config.get('NATS_NKEY') ?? ''))
}))
export class DefaultNatsConnection {}
```

### 2. Define a stream (optional, for JetStream)

```ts
import { NatsStream } from '@wisemen/nestjs-nats'
import { RetentionPolicy } from '@nats-io/jetstream'
import { DefaultNatsConnection } from './default-nats-connection.js'

@NatsStream((config) => ({
  connection: DefaultNatsConnection,
  name: 'orders',
  subjects: ['orders.>'],
  retention: RetentionPolicy.Limits,
  max_msgs: 100_000
}))
export class OrdersStream {}
```

### 3. Create a subscriber

```ts
import {
  NatsSubscriber, OnNatsMessage,
  NatsMessageData, NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
import { DefaultNatsConnection } from './default-nats-connection.js'

@NatsSubscriber((config) => ({
  connection: DefaultNatsConnection,
  subject: 'orders.created',
}))
export class OrderCreatedSubscriber {
  @OnNatsMessage()
  async handle(
    @NatsMessageData(NatsMsgDataJsonPipe) data: OrderCreatedEvent,
  ): Promise<void> {
    // Handle the order created event
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
    this.nats.publish('orders.created', new TextEncoder().encode(JSON.stringify(order)),)
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
