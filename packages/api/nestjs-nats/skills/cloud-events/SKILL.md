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
import { DefaultNatsConnection } from './default-nats-connection.js'

class OrderPlacedData {
  @IsString() orderId: string
  @IsNumber() total: number
}

@NatsSubscriber((config) => ({
  connection: DefaultNatsConnection,
  subject: 'orders.events',
}))
export class OrderEventsSubscriber {
  @OnNatsCloudEvent({ type: 'com.example.order.placed', version: '0.0.1' })
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
// order-placed.integration.event.ts
import { ApiProperty } from '@nestjs/swagger'
import { CloudEvent } from '@wisemen/nestjs-nats'
import { createChannel } from '@wisemen/nestjs-async-api'

export class OrderPlacedEventContent {
  @ApiProperty({ type: String })
  uuid: string

  @ApiProperty({ type: Number })
  total: number

  constructor(order: Order) {
    this.uuid = order.uuid
    this.total = order.total
  }
}

export class OrderPlacedIntegrationEvent extends CloudEvent {
  @ApiProperty({
    enumName: 'OrderPlacedIntegrationEventType',
    enum: [IntegrationEventType.ORDER_PLACED]
  })
  declare type: IntegrationEventType.ORDER_PLACED

  @ApiProperty({ type: OrderPlacedEventContent })
  declare data: OrderPlacedEventContent

  constructor (order: Order) {
    super({
      type: IntegrationEventType.ORDER_PLACED,
      data: new OrderPlacedEventContent(order),
      version: '0.0.1'
    })
  }
}

export const OrderPlacedNatsSubject = 'my-application.{env}.order.{orderUuid}.created'
export const OrderPlacedChannel = createChannel(OrderPlacedNatsSubject, {
  parameters: {
    env: {
      enum: Object.values(EnvType),
      description: 'The environment from which the event originates',
      examples: [EnvType.DEVELOPMENT]
    },
    orderUuid: {
      description: 'The uuid of the order'
    }
  },
  operations: {
    sendOrderPlaced: {
      action: 'send',
      summary: 'this message is sent when an order is placed',
      messages: [OrderPlacedIntegrationEvent]
    }
  }
})
```

```ts
// order.service.ts
import { NatsClient, CloudEvent } from '@wisemen/nestjs-nats'

@Injectable()
export class OrderService {
  constructor(private readonly natsClient: NatsClient) {}

  publishOrderPlaced(order: Order): void {
    const subject = OrderPlacedChannel.subject({ env: EnvType.PRODUCTION, orderUuid: order.uuid })
    this.natsClient.publish(
      subject,
      new TextEncoder().encode(JSON.stringify(new OrderPlacedIntegrationEvent(order))),
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
