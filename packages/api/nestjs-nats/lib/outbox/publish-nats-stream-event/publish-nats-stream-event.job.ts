import { JetStreamPublishOptions } from '@nats-io/jetstream'
import { SECONDS_PER_MINUTE } from '@wisemen/datewise'
import { BaseJob } from '@wisemen/pgboss-nestjs-job'

export type NatsStreamPublishOptions = Omit<
  Exclude<Partial<JetStreamPublishOptions>, undefined>,
  'headers'
>

export interface NatsStreamOutboxEvent {
  subject: string
  serializedMessage: string
  options?: NatsStreamPublishOptions
}

export class PublishNatsStreamEventJob extends BaseJob<NatsStreamOutboxEvent> {
  private static readonly EXPIRES_IN_MINUTES = 5

  constructor (data: NatsStreamOutboxEvent) {
    super(data, {
      priority: 0,
      retryLimit: 3,
      retryBackoff: false,
      expireInSeconds: PublishNatsStreamEventJob.EXPIRES_IN_MINUTES * SECONDS_PER_MINUTE
    })
  }
}
