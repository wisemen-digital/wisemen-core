import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { PublishNatsEventJob } from '../publish-nats-event/publish-nats-event.job.js'
import { type NatsStreamPublishOptions, PublishNatsStreamEventJob } from '../publish-nats-stream-event/publish-nats-stream-event.job.js'

export type NatsPublisherEventWithSubject<TEvent = unknown> = {
  event: TEvent
  onSubject: string
}

export type NatsPublisherStreamEventWithSubject<TEvent = unknown> = {
  event: TEvent
  onSubject: string
  options?: NatsStreamPublishOptions
}

@Injectable()
export class NatsPublisher {
  constructor (
    private jobScheduler: PgBossScheduler
  ) {}

  /** Publishes the event asynchronously in a job */
  async publish<TEvent> (event: TEvent, onSubject: string): Promise<void>
  async publish<TEvent> (event: TEvent[], onSubject: string): Promise<void>
  async publish<TEvent> (events: NatsPublisherEventWithSubject<TEvent>[]): Promise<void>
  async publish (
    eventsOrEvent: unknown[] | unknown | NatsPublisherEventWithSubject[],
    onSubject?: string
  ): Promise<void> {
    const events = Array.isArray(eventsOrEvent) ? eventsOrEvent : [eventsOrEvent]

    const jobs: PublishNatsEventJob[] = []
    for (const event of events) {
      if (isEventWithSubject(event)) {
        jobs.push(new PublishNatsEventJob({
          subject: event.onSubject,
          serializedMessage: JSON.stringify(event.event)
        }))

        continue
      }

      if (onSubject == null) {
        throw new Error('NatsPublisher.publish requires an onSubject when publishing raw events')
      }

      jobs.push(new PublishNatsEventJob({
        subject: onSubject,
        serializedMessage: JSON.stringify(event)
      }))
    }

    await this.jobScheduler.scheduleJobs(jobs)
  }

  /** Publishes the event asynchronously into a JetStream stream via a job */
  async publishToStream<TEvent> (event: TEvent, onSubject: string, options?: NatsStreamPublishOptions): Promise<void>
  async publishToStream<TEvent> (event: TEvent[], onSubject: string, options?: NatsStreamPublishOptions): Promise<void>
  async publishToStream<TEvent> (events: NatsPublisherStreamEventWithSubject<TEvent>[]): Promise<void>
  async publishToStream (
    eventsOrEvent: unknown[] | unknown | NatsPublisherStreamEventWithSubject[],
    onSubject?: string,
    options?: NatsStreamPublishOptions
  ): Promise<void> {
    const events = Array.isArray(eventsOrEvent) ? eventsOrEvent : [eventsOrEvent]

    const jobs: PublishNatsStreamEventJob[] = []
    for (const event of events) {
      if (isStreamEventWithSubject(event)) {
        jobs.push(new PublishNatsStreamEventJob({
          subject: event.onSubject,
          serializedMessage: JSON.stringify(event.event),
          options: event.options
        }))

        continue
      }

      if (onSubject == null) {
        throw new Error('NatsPublisher.publishToStream requires an onSubject when publishing raw events')
      }

      jobs.push(new PublishNatsStreamEventJob({
        subject: onSubject,
        serializedMessage: JSON.stringify(event),
        options
      }))
    }

    await this.jobScheduler.scheduleJobs(jobs)
  }
}

function isEventWithSubject (event: unknown): event is NatsPublisherEventWithSubject {
  return typeof event === 'object'
    && event !== null
    && 'event' in event
    && 'onSubject' in event
}

function isStreamEventWithSubject (event: unknown): event is NatsPublisherStreamEventWithSubject {
  return typeof event === 'object'
    && event !== null
    && 'event' in event
    && 'onSubject' in event
}
