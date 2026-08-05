import { SECONDS_PER_MINUTE } from '@wisemen/datewise'
import { BaseJob } from '@wisemen/pgboss-nestjs-job'

export interface NatsOutboxEvent {
  subject: string
  serializedMessage: string
}

export class PublishNatsEventJob extends BaseJob<NatsOutboxEvent> {
  private static readonly EXPIRES_IN_MINUTES = 5

  constructor (data: NatsOutboxEvent) {
    super(data, {
      priority: 0,
      retryLimit: 3,
      retryBackoff: false,
      expireInSeconds: PublishNatsEventJob.EXPIRES_IN_MINUTES * SECONDS_PER_MINUTE
    })
  }
}
