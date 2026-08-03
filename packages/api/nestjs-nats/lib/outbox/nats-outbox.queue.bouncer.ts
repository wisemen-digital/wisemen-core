import { PgbossBouncer } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '@wisemen/nestjs-nats'
import { Inject } from '@nestjs/common'

export const NATS_OUTBOX_QUEUE_BOUNCER_NATS_CLIENT = 'wisemen.nats-outbox-queue-bouncer-nats-client'

export class NatsOutboxQueueBouncer implements PgbossBouncer {
  constructor (
    @Inject(NATS_OUTBOX_QUEUE_BOUNCER_NATS_CLIENT) private client: NatsClient
  ) {}

  async canProceed (): Promise<boolean> {
    const isConnected = this.client.isConnected()
    if (isConnected) {
      return true
    }

    return await this.client.reconnect()
  }
}
