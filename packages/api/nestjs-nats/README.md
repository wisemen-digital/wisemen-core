# @wisemen/nestjs-nats

NestJS integration for NATS messaging, including:

- Decorator-driven subscriber, consumer, and service-endpoint handlers
- JetStream stream management
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
      defaultClient: MyNatsConnection,
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

### 4. Register the simple client

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

### 5. Publish messages

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
