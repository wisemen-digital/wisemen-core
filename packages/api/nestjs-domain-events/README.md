# @wisemen/nestjs-domain-events

Decorator-based domain events for NestJS applications.

This package provides:

- `DomainEvent` as the base event model
- `@RegisterDomainEvent(...)` for stable event type and version metadata
- `DomainEventEmitter` for emitting one or many events
- `@Subscribe(...)` for event-specific subscribers
- `@SubscribeToAll()` for cross-cutting subscribers such as logging
- optional emission middleware through `DomainEventEmitterModule`

## Installation

```bash
pnpm add @wisemen/nestjs-domain-events
```

### Peer dependencies

```bash
pnpm add @nestjs/common @nestjs/core @opentelemetry/api @wisemen/opentelemetry
```

## Define Events

The common pattern is:

- define a `DomainEventSubjectType` enum for aggregate kinds
- define a `DomainEventType` enum for concrete business events
- create one base event class per aggregate
- register concrete event subclasses with `@RegisterDomainEvent(...)`

This mirrors the template project structure.

```ts
import { DomainEvent, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { SubjectedEventOptions } from '@wisemen/nestjs-domain-events'

export type ContactUuid = string

export enum DomainEventSubjectType {
  CONTACT = 'contact'
}

export enum DomainEventType {
  CONTACT_CREATED = 'contact.created',
  CONTACT_UPDATED = 'contact.updated',
  CONTACT_DELETED = 'contact.deleted'
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

Keep the aggregate-specific base class in a shared `events/` folder, then define
business events such as `ContactCreatedEvent`, `ContactUpdatedEvent`, or
`ContactDeletedEvent` in their own use-case folders.

## Register The Module

Wrap `DomainEventEmitterModule` in an application module. The template project
imports a dedicated `DomainEventSubscribersModule` plus optional middleware
dependencies, then configures the emitter through `forRootAsync(...)`.

```ts
import { Global, Module } from '@nestjs/common'
import {
  DomainEventEmitterModule,
  type DomainEventEmitFunction
} from '@wisemen/nestjs-domain-events'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { DomainEventSubscribersModule } from '#src/modules/domain-events/domain-event-subscribers.module.js'
import { DefaultPgBossSchedulerModule } from '#src/modules/pgboss/default-pgboss-scheduler.module.js'
import { DomainEventLogContextModule } from '#src/modules/domain-event-log/modules/domain-event-log-context/domain-event-log.context.module.js'
import { DomainEventLogContext } from '#src/modules/domain-event-log/modules/domain-event-log-context/domain-event-log.context.js'

@Global()
@Module({
  imports: [
    DomainEventEmitterModule.forRootAsync({
      imports: [
        DefaultPgBossSchedulerModule,
        DomainEventLogContextModule,
        DomainEventSubscribersModule
      ],
      inject: [PgBossScheduler, DomainEventLogContext],
      useFactory: (scheduler: PgBossScheduler, logCtx: DomainEventLogContext) => {
        return {
          middleware: async (emit: DomainEventEmitFunction) => {
            const scheduleCb = async () => await scheduler.runAndCaptureJobs(emit)
            await logCtx.runAndCaptureLogs(scheduleCb)
          }
        }
      }
    })
  ]
})
export class DefaultDomainEventModule {}
```

Use `forRoot(...)` when no injected middleware dependencies are needed.

## Emit Events From A Use Case

Inject `DomainEventEmitter` into the application service or use case and emit
events after the state change. In the template project this happens inside the
same database transaction as the write.

```ts
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'

@Injectable()
export class CreateContactUseCase {
  constructor (
    private readonly datasource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly repository: CreateContactRepository
  ) {}

  async execute(command: CreateContactCommand): Promise<void> {
    const contact = Contact.create(command)
    const event = new ContactCreatedEvent(contact.uuid)

    await transaction(this.datasource, async () => {
      await this.repository.insert(contact)
      await this.eventEmitter.emit([event])
    })
  }
}
```

Use `emitOne(event)` when you only have a single event instance.

## Subscribe To Specific Events

Subscribers are ordinary Nest providers. Register them in a module, then import
that module somewhere below `DomainEventEmitterModule`.

```ts
import { Injectable } from '@nestjs/common'
import { Subscribe } from '@wisemen/nestjs-domain-events'

@Injectable()
export class ContactCreatedSubscriber {
  @Subscribe(ContactCreatedEvent)
  async handle (events: ContactCreatedEvent[]): Promise<void> {
    for (const event of events) {
      console.info('Project contact', event.content.uuid)
    }
  }
}
```

When the event payload is not needed, the subscriber can omit the method
parameter. The template project uses this pattern for Typesense sync jobs.

```ts
import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { Subscribe } from '@wisemen/nestjs-domain-events'

@Injectable()
export class ContactTypesenseSubscriber {
  constructor (
    private readonly jobScheduler: PgBossScheduler
  ) {}

  @Subscribe(ContactCreatedEvent)
  @Subscribe(ContactUpdatedEvent)
  @Subscribe(ContactDeletedEvent)
  async handle (): Promise<void> {
    await this.jobScheduler.scheduleJob(new SyncTypesenseJob('contact'))
  }
}
```

Subscribers receive arrays grouped by event type, so one method call handles all
`contact.created` events from a single `emit(...)` call.

Register subscriber providers through normal Nest modules.

```ts
import { Module } from '@nestjs/common'

@Module({
  providers: [ContactCreatedSubscriber]
})
export class ContactCreatedSubscriberModule {}
```

## Subscribe To All Events

Use `@SubscribeToAll()` for logging, auditing, or tracing concerns that should
run for every emitted domain event.

```ts
import { Injectable } from '@nestjs/common'
import { DomainEvent, SubscribeToAll } from '@wisemen/nestjs-domain-events'

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

## Middleware

Use emitter middleware when event handling must run inside additional execution
context such as job scheduling, logging, tracing, or AsyncLocalStorage scopes.

```ts
import { DomainEventEmitterModule } from '@wisemen/nestjs-domain-events'

DomainEventEmitterModule.forRoot({
  middleware: async (emit, events) => {
    console.debug(`Emitting ${events.length} domain event(s)`)
    await emit()
  }
})
```

The middleware receives the original event list plus an `emit()` callback that
invokes all matching subscribers.
