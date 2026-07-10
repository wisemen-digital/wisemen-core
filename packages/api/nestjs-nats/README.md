# @wisemen/nestjs-nats

NestJS integration for NATS messaging, including:

- Decorator-driven subscriber, consumer, and service-endpoint handlers
- JetStream stream management and publishing
- CloudEvent routing
- Parameter injection with pipes
- Simple client wrapper for fire-and-forget pub/sub

## Installation

```bash
npm install @wisemen/nestjs-nats
```

### Peer dependencies

```bash
npm install @nestjs/common @nestjs/config @nestjs/core @opentelemetry/api class-transformer class-validator reflect-metadata rxjs
```

## Quick start

### 1. Register the application module

```ts
import { NatsModule } from '@wisemen/nestjs-nats'

@Module({
  imports: [
    NatsModule.forRoot({
      modules: [MySubscriberModule, MyConsumerModule],
      streams: [MyStream],
    }),
  ],
})
export class NatsAppModule {}
```

### 2. Define a connection client

```ts
import { NatsConnection } from '@wisemen/nestjs-nats'
import type { ConfigService } from '@nestjs/config'

@NatsConnection((config: ConfigService) => ({
  name: 'default',
  servers: config.getOrThrow('NATS_ENDPOINT'),
}))
export class MyNatsConnection {}
```

### 3. Subscribe to messages

```ts
import { NatsSubscriber, OnNatsMessage, NatsMessageData, NatsMsgDataJsonPipe } from '@wisemen/nestjs-nats'

@NatsSubscriber((config) => ({
  subject: 'my.subject',
  name: 'my-subscriber',
}))
export class MySubscriber {
  @OnNatsMessage()
  async handle(@NatsMessageData(NatsMsgDataJsonPipe) payload: unknown): Promise<void> {
    // ...
  }
}
```

### 4. Define a stream

Streams are declared as classes with the `@NatsStream` decorator, tied to a
connection client, and registered on `NatsModule.forRoot({ streams: [...] })`.
Each registered stream is created (or updated to match the config) at startup.

```ts
import { NatsStream } from '@wisemen/nestjs-nats'
import { RetentionPolicy } from '@nats-io/jetstream'
import type { ConfigService } from '@nestjs/config'

@NatsStream((config: ConfigService) => ({
  connection: MyNatsConnection,
  name: 'orders',
  subjects: ['orders.>'],
  retention: RetentionPolicy.Limits,
  max_age: 0,
  max_bytes: -1,
  max_msgs: -1,
}))
export class OrdersStream {}
```

### 5. Consume from a stream

To read messages back off a stream, define a **consumer**. Unlike the core NATS
subscriber in step 3 (fire-and-forget, no redelivery), a JetStream consumer reads
persisted messages and redelivers them until they are acknowledged.

`@NatsConsumer` registers the class both as the consumer definition and as its own
message handler, so the `@OnNatsMessage()` handler methods live on the same class.
Give it a `durable_name` so the consumer survives restarts and resumes where it
left off; omit it for an ephemeral consumer that starts fresh each boot.

```ts
import { NatsConsumer, OnNatsMessage, NatsMessageData, NatsMsgDataJsonPipe } from '@wisemen/nestjs-nats'
import { AckPolicy } from '@nats-io/jetstream'
import type { ConfigService } from '@nestjs/config'

@NatsConsumer((config: ConfigService) => ({
  connection: MyNatsConnection,
  streamName: 'orders',
  durable_name: 'orders-processor',
  filter_subject: 'orders.created',
  ack_policy: AckPolicy.Explicit,
  // nakBackoff: 5000, // optional delay (ms) before a failed message is redelivered
}))
export class OrdersConsumer {
  @OnNatsMessage()
  async handle(@NatsMessageData(NatsMsgDataJsonPipe) payload: unknown): Promise<void> {
    // process the message
  }
}
```

Acknowledgement is handled for you: the message is `ack`-ed once the handler
resolves, and `nak`-ed (redelivered, optionally after `nakBackoff` ms) if the
handler throws. Register the consumer's module the same way as a subscriber:

```ts
NatsModule.forRoot({
  modules: [OrdersModule], // the module that provides OrdersConsumer
  streams: [OrdersStream],
})
```

For CloudEvent-typed streams, route by event type with
`@OnNatsMessage({ event: { type: 'order.created', specversion: '1.0' } })` (or
`@OnNatsCloudEvent(...)`) and add a plain `@OnNatsMessage()` method as the
fallback handler.

### 6. Register the simple client

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NatsClientModule } from '@wisemen/nestjs-nats'
import { credsAuthenticator } from '@nats-io/transport-node'

@Module({
  imports: [
    NatsClientModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        client: {
          servers: config.getOrThrow('NATS_ENDPOINT'),
          authenticator: credsAuthenticator(
            new TextEncoder().encode(config.getOrThrow('NATS_CREDS'))
          ),
        },
        onConnectError: (error) => {
          console.error('Initial NATS connection failed', error)
        },
      }),
    }),
  ],
  exports: [NatsClientModule],
})
export class OutboundNatsModule {}
```

`client` is passed straight to `@nats-io/transport-node`, so authentication
should be configured with `client.authenticator`. `onConnectError` only runs
when a connection attempt fails before the first successful connection;
`captureException(...)` is already called before that callback executes.

### 7. Publish fire-and-forget messages

`NatsClient.publish` sends a plain core NATS message: it is not persisted and
there is no server acknowledgement. Use `publishToStream` (next step) when you
need JetStream persistence and a `PubAck`.

```ts
import { Injectable } from '@nestjs/common'
import { NatsClient } from '@wisemen/nestjs-nats'

@Injectable()
export class MyService {
  constructor(private readonly nats: NatsClient) {}

  async notifySomething(): Promise<void> {
    await this.nats.publish(
      'my.subject',
      new TextEncoder().encode(JSON.stringify({ hello: 'world' }))
    )
  }
}
```

### 8. Publish to a stream

`NatsClient.publishToStream` publishes onto a JetStream stream and waits for the
server to acknowledge it, returning a `PubAck`. The subject must be captured by a
stream on the server — created via the `NatsModule` framework (step 4) or
out-of-band. Nothing extra needs to be registered on the client: it reuses the
same connection as `publish`.

```ts
import { Injectable } from '@nestjs/common'
import { NatsClient } from '@wisemen/nestjs-nats'

@Injectable()
export class OrdersService {
  constructor(private readonly nats: NatsClient) {}

  async placeOrder(): Promise<void> {
    const ack = await this.nats.publishToStream(
      'orders.created',
      new TextEncoder().encode(JSON.stringify({ id: '123' })),
      { msgID: '123' } // optional: dedup within the stream's duplicate window
    )

    // ack.stream, ack.seq, ack.duplicate
  }
}
```
