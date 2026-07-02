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
      defaultClient: MyNatsClient,
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
import { NatsSubscriber, OnNatsMessage, NatsMessageData } from '@wisemen/nestjs-nats'

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

### 4. Simple client (fire-and-forget publish)

```ts
import { NatsClient, NatsClientModule } from '@wisemen/nestjs-nats'

@Module({
  imports: [NatsClientModule],
  providers: [MyService],
})
export class AppModule {}

@Injectable()
export class MyService {
  constructor(private readonly nats: NatsClient) {}

  async notifySomething(): Promise<void> {
    this.nats.publish('my.subject', new TextEncoder().encode(JSON.stringify({ hello: 'world' })))
  }
}
```