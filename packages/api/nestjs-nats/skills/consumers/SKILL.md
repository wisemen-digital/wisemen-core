---
name: consumers
description: >
  Create JetStream consumers with @NatsConsumer for durable, at-least-once message
  delivery from a stream. Supports delivery policies, explicit acknowledgment,
  backoff retries, and filter subjects.
type: feature
library: nestjs-nats
requires:
  - getting-started
exports:
  - NatsConsumer
  - NatsConsumerHandler
---

# @wisemen/nestjs-nats — Consumers

Process durable JetStream messages with explicit acknowledgment, configurable delivery policies, and retry backoff.

## When to Use

- Processing messages with at-least-once delivery guarantees
- Building durable consumers that survive restarts without losing messages
- Filtering a stream's subjects to consume only specific message types

**Use instead:** `@NatsSubscriber` for fire-and-forget pub/sub without durability or acknowledgment.

## Import

```ts
import {
  NatsConsumer, NatsConsumerHandler,
  OnNatsMessage, NatsMessageData, NatsMessage,
  NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
```

## Quick Start

```ts
import {
  NatsConsumer, OnNatsMessage,
  NatsMessageData, NatsMessage, NatsMsgDataJsonPipe,
} from '@wisemen/nestjs-nats'
import { DeliverPolicy, AckPolicy } from '@nats-io/jetstream'
import { nanos } from '@nats-io/transport-node'
import type { JsMsg } from '@nats-io/jetstream'
import { DefaultNatsConnection } from './default-nats-connection.js'

@NatsConsumer((config) => ({
  connection: DefaultNatsConnection,
  streamName: 'orders',
  ack_policy: AckPolicy.Explicit,
  deliver_policy: DeliverPolicy.All,
  replay_policy: ReplayPolicy.Instant,
  filter_subject: 'orders.created'
}))
export class OrderCreatedConsumer {
  @OnNatsCloudEvent({
    type: 'order.created',
    version: '0.0.1'
  })
  async handle(
    @NatsMessageData(NatsMsgDataJsonPipe, NatsMsgDataCloudEventPipe) data: OrderCreatedIntegrationEvent,
    @NatsMessageSubject() subject: string
  ): Promise<void> {
    // Process the message
    msg.ack()
  }
}
```

Key consumer config options: `durable_name` for persistence across restarts, `filter_subject` to consume a subset of the stream, `ack_wait` for acknowledgment timeout, `max_deliver` for retry limit.

## Source Files

For full API details, read the source files.

- Consumer decorator: `lib/consumers/nats-consumer.decorator.ts`
- Consumer manager: `lib/consumers/nats-consumer.manager.ts`

## See Also

- [getting-started](../getting-started/SKILL.md) -- Set up NatsModule, connections, and streams
- [cloud-events](../cloud-events/SKILL.md) -- Consume CloudEvents with automatic validation
