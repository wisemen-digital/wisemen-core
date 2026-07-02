import { Inject, Injectable, Optional } from '@nestjs/common'
import type { Span } from '@opentelemetry/api'
import { getOtelTracer } from '@wisemen/opentelemetry'
import { DomainEvent } from './domain-event.js'
import { DOMAIN_EVENT_EMITTER_MIDDLEWARE, type DomainEventEmitterMiddleware } from './domain-event-emitter.middleware.js'

export type EventSubscriberMethod = (event: DomainEvent[]) => Promise<void>

@Injectable()
export class DomainEventEmitter {
  private subscribers = new Map<string, EventSubscriberMethod[]>()
  private globalSubscribers: EventSubscriberMethod[] = []

  constructor (
    @Optional()
    @Inject(DOMAIN_EVENT_EMITTER_MIDDLEWARE)
    private middleware?: DomainEventEmitterMiddleware
  ) {}

  addSubscriber (toEvent: string, subscriber: EventSubscriberMethod): void {
    const eventSubscribers = this.subscribers.get(toEvent) ?? []

    eventSubscribers.push(subscriber)
    this.subscribers.set(toEvent, eventSubscribers)
  }

  addGlobalSubscriber (subscriber: EventSubscriberMethod): void {
    this.globalSubscribers.push(subscriber)
  }

  async emitOne (event: DomainEvent): Promise<void> {
    await this.emit([event])
  }

  async emit<Event extends DomainEvent>(events: Event[]): Promise<void> {
    if (events.length === 0) {
      return
    }

    const eventsPerType = new Map<string, Event[]>()
    for (const event of events) {
      const events = eventsPerType.get(event.type) ?? []
      events.push(event)
      eventsPerType.set(event.type, events)
    }

    const emitFunction = async () => {
      for (const [eventType, eventsOfType] of eventsPerType.entries()) {
        await this.emitEventsOfType<Event>(eventType, eventsOfType)
      }
    }

    if (this.middleware === undefined) {
      await emitFunction()
      return
    }

    await this.middleware(emitFunction, events)
  }

  private async emitEventsOfType<Event extends DomainEvent>(
    eventType: string,
    eventsOfType: Event[]
  ): Promise<void> {
    const tracer = getOtelTracer()

    await tracer.startActiveSpan(`EMIT ${eventType}`, async (span: Span) => {
      span.setAttribute('domain-event.type', eventType)
      try {
        await this.tryEmitEventsOfType<Event>(eventType, eventsOfType)
      } finally {
        span.end()
      }
    })
  }

  private async tryEmitEventsOfType<Event extends DomainEvent>(
    eventType: string,
    eventsOfType: Event[]
  ): Promise<void> {
    const subscribers = this.subscribers.get(eventType) ?? []

    for (const subscriberCallback of subscribers) {
      await subscriberCallback(eventsOfType)
    }

    for (const subscriberCallback of this.globalSubscribers) {
      await subscriberCallback(eventsOfType)
    }
  }
}
