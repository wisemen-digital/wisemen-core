import { Injectable } from '@nestjs/common'
import { JobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '../../nats.client.js'
import { type NatsOutboxEvent, PublishNatsEventJob } from './publish-nats-event.job.js'

@Injectable()
export class PublishNatsEventJobHandler extends JobHandler<PublishNatsEventJob> {
  constructor (
    private natsClient: NatsClient
  ) {
    super()
  }

  async run (event: NatsOutboxEvent): Promise<void> {
    await this.natsClient.publish(event.subject, event.serializedMessage)
  }
}
