---
name: getting-started
description: Use when working with domain events and subscribers in NestJS applications.
---

# @wisemen/nestjs-domain-events - Getting Started

Use `@RegisterDomainEvent(...)` on `DomainEvent` subclasses, emit them through
`DomainEventEmitter`, and register subscriber providers with `@Subscribe(...)`
or `@SubscribeToAll()`. In app code, wrap `DomainEventEmitterModule` in a local
module and import your subscriber modules there.

## Register The Module

```ts
import { Global, Module } from '@nestjs/common'
import { DomainEventEmitterModule } from '@wisemen/nestjs-domain-events'
import { DomainEventSubscribersModule } from '#src/modules/domain-events/domain-event-subscribers.module.js'

@Global()
@Module({
  imports: [
    DomainEventEmitterModule.forRoot({
      middleware: async (emit) => {
        await emit()
      }
    }),
    DomainEventSubscribersModule
  ]
})
export class DefaultDomainEventModule {}
```

Switch to `forRootAsync(...)` when the middleware depends on injected services
such as schedulers or request-scoped logging context.

## Define And Emit An Event

```ts
import { DomainEvent, DomainEventEmitter, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { SubjectedEventOptions } from '@wisemen/nestjs-domain-events'

export type ContactUuid = string

export enum DomainEventSubjectType {
  CONTACT = 'contact'
}

export enum DomainEventType {
  CONTACT_CREATED = 'contact.created'
}

export class ContactCreatedEventContent {
  constructor (readonly uuid: ContactUuid) {}
}

export class ContactEvent<Content extends object> extends DomainEvent<Content> {
  constructor (options: SubjectedEventOptions<Content, { contactUuid: ContactUuid }>) {
    super({
      ...options,
      subjectId: options.contactUuid,
      subjectType: DomainEventSubjectType.CONTACT
    })
  }
}

@RegisterDomainEvent(DomainEventType.CONTACT_CREATED, 1)
export class ContactCreatedEvent extends ContactEvent<ContactCreatedEventContent> {
  constructor (contactUuid: ContactUuid) {
    super({
      contactUuid,
      content: new ContactCreatedEventContent(contactUuid)
    })
  }
}
```

```ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateContactUseCase {
  constructor (
    private readonly eventEmitter: DomainEventEmitter
  ) {}

  async execute(contactUuid: ContactUuid): Promise<void> {
    await this.eventEmitter.emit([
      new ContactCreatedEvent(contactUuid)
    ])
  }
}
```

## Subscribe

```ts
import { Injectable } from '@nestjs/common'
import { DomainEvent, Subscribe, SubscribeToAll } from '@wisemen/nestjs-domain-events'

@Injectable()
export class ContactProjectionSubscriber {
  @Subscribe(ContactCreatedEvent)
  async handle (events: ContactCreatedEvent[]): Promise<void> {
    for (const event of events) {
      console.info('Project contact', event.content.uuid)
    }
  }
}

@Injectable()
export class DomainEventLogSubscriber {
  @SubscribeToAll()
  handle (events: DomainEvent[]): void {
    for (const event of events) {
      console.info(event.type, event.subjectId)
    }
  }
}
```

Subscriber methods are called with arrays grouped by event type for each
`emit(...)` call.

Subscribers need to be added to the imports in the `forRoot` or `forRootAsync` call of the `DomainEventEmitterModule`. This is commonly done by grouping them in a `DomainEventSubscriberModule` which is imported instead.
