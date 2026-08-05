import { Injectable } from '@nestjs/common'
import { JobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '../../nats.client.js'
import { type NatsStreamOutboxEvent, PublishNatsStreamEventJob } from './publish-nats-stream-event.job.js'

@Injectable()
export class PublishNatsStreamEventJobHandler extends JobHandler<PublishNatsStreamEventJob> {
  constructor (
    private natsClient: NatsClient
  ) {
    super()
  }

  async run (event: NatsStreamOutboxEvent): Promise<void> {
    await this.natsClient.publishToStream(event.subject, event.serializedMessage, event.options)
  }
}
