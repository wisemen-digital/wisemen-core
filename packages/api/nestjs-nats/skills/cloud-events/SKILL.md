---
name: cloud-events
description: >
  Publish and consume CloudEvents over NATS using the CloudEvent model,
  @OnNatsCloudEvent for type-filtered handling, and @NatsCloudEventData for
  automatic envelope validation and data extraction.
type: feature
library: nestjs-nats
requires:
  - getting-started
exports:
  - CloudEvent
  - OnNatsCloudEvent
  - NatsCloudEventData
  - NatsMsgDataCloudEventValidationPipe
  - NatsMsgDataCloudEventPipe
---

# @wisemen/nestjs-nats — CloudEvents

Publish and consume CloudEvents-spec messages over NATS with automatic envelope validation and typed data extraction.

## When to Use

- Publishing or consuming events following the CloudEvents specification
- Routing messages by event type and version within a single subject
- Validating CloudEvent envelope structure (id, source, type, specversion) automatically

**Use instead:** Plain `@OnNatsMessage` with `NatsMsgDataJsonPipe` when your messages don't follow the CloudEvents spec.

## Import

```ts
import {
  CloudEvent, OnNatsCloudEvent, NatsCloudEventData,
} from '@wisemen/nestjs-nats'
```

## Quick Start

### Consuming CloudEvents

```ts
import {
  NatsSubscriber, OnNatsCloudEvent, NatsCloudEventData,
} from '@wisemen/nestjs-nats'
import { IsString, IsNumber } from 'class-validator'
import { AppNatsConnection } from './app-nats-connection.js'

class OrderPlacedData {
  @IsString() orderId: string
  @IsNumber() total: number
}

@NatsSubscriber((config) => ({
  connection: AppNatsConnection,
  subject: 'orders.events',
}))
export class OrderEventsSubscriber {
  @OnNatsCloudEvent({ type: 'com.example.order.placed', version: '1.0' })
  async handleOrderPlaced(
    @NatsCloudEventData() data: OrderPlacedData,
  ): Promise<void> {
    // data is validated against OrderPlacedData using class-validator
  }
}
```

`@NatsCloudEventData` applies a validation pipeline: JSON parse -> CloudEvent envelope validation -> extract `.data` -> validate against the parameter type with class-validator.

### Publishing CloudEvents

```ts
import { NatsClient, CloudEvent } from '@wisemen/nestjs-nats'

@Injectable()
export class OrderService {
  constructor(private readonly nats: NatsClient) {}

  publishOrderPlaced(orderId: string, total: number): void {
    const event: CloudEvent = {
      id: crypto.randomUUID(),
      specversion: '1.0',
      type: 'com.example.order.placed',
      source: '/orders',
      datacontenttype: 'application/json',
      time: new Date().toISOString(),
      data: { orderId, total },
    }

    this.nats.publish(
      'orders.events',
      new TextEncoder().encode(JSON.stringify(event)),
    )
  }
}
```

## Source Files

For full API details, read the source files.

- CloudEvent model: `lib/cloud-event/cloud-event.ts`
- CloudEvent handler decorator: `lib/message-handler/on-nats-cloud-event.decorator.ts`
- CloudEvent data decorator: `lib/parameters/nats-cloud-event-data.decorator.ts`
- Validation pipe: `lib/parameters/pipes/nats-message-cloud-event-validation.pipe.ts`
- CloudEvent extraction pipe: `lib/parameters/pipes/nats-message-cloud-event.pipe.ts`

## See Also

- [getting-started](../getting-started/SKILL.md) -- Set up NatsModule, connections, and subscribers
- [consumers](../consumers/SKILL.md) -- Durable JetStream consumers (can also use CloudEvents)
