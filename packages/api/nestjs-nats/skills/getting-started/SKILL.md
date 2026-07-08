---
name: getting-started
description: Use when configuring NATS messaging, subscribers, or the simple NatsClient in NestJS applications.
---

# @wisemen/nestjs-nats - Getting Started

Use `NatsModule.forRoot(...)` for decorator-driven subscribers, consumers,
services, and streams. Use `NatsClientModule.forRootAsync(...)` when you only
need the fire-and-forget `NatsClient` publisher.

## Register The Application Module

```ts
import { Module } from '@nestjs/common'
import { NatsModule } from '@wisemen/nestjs-nats'

@Module({
  imports: [
    NatsModule.forRoot({
      modules: [MySubscriberModule, MyConsumerModule],
      defaultClient: MyNatsConnection,
      streams: [MyStream]
    })
  ]
})
export class NatsAppModule {}
```

## Define A Connection And Subscriber

```ts
import { ConfigService } from '@nestjs/config'
import { NatsConnection, NatsSubscriber, OnNatsMessage, NatsMessageData, NatsMsgDataJsonPipe } from '@wisemen/nestjs-nats'

@NatsConnection((config: ConfigService) => ({
  name: 'default',
  servers: config.getOrThrow('NATS_ENDPOINT')
}))
export class MyNatsConnection {}

@NatsSubscriber(() => ({
  subject: 'my.subject',
  name: 'my-subscriber'
}))
export class MySubscriber {
  @OnNatsMessage()
  async handle (@NatsMessageData(NatsMsgDataJsonPipe) payload: unknown): Promise<void> {
    console.info(payload)
  }
}
```

## Register The Simple Client

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { credsAuthenticator } from '@nats-io/transport-node'
import { NatsClientModule } from '@wisemen/nestjs-nats'

@Module({
  imports: [NatsClientModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      client: {
        servers: config.getOrThrow('NATS_ENDPOINT'),
        authenticator: credsAuthenticator(
          new TextEncoder().encode(config.getOrThrow('NATS_CREDS'))
        )
      },
      onConnectError: (error) => {
        console.error('Initial NATS connection failed', error)
      }
    })
  })],
  exports: [NatsClientModule]
})
export class OutboundNatsModule {}
```

`client` is passed directly to `@nats-io/transport-node`. If you use NATS
credentials, pass them through `client.authenticator`; there is no separate
package-level `nkey` option.

`onConnectError` runs only when a connection attempt fails before the first
successful connection. Later disconnects and reconnects are handled by the
underlying NATS client.

## Publish Messages

```ts
import { Injectable } from '@nestjs/common'
import { NatsClient } from '@wisemen/nestjs-nats'

@Injectable()
export class MyService {
  constructor (private readonly nats: NatsClient) {}

  async notifySomething (): Promise<void> {
    await this.nats.publish(
      'my.subject',
      new TextEncoder().encode(JSON.stringify({ hello: 'world' }))
    )
  }
}
```
