import { PgbossBouncer } from '@wisemen/pgboss-nestjs-job'
import { NatsClient } from '@wisemen/nestjs-nats'

export class NatsOutboxQueueBouncer implements PgbossBouncer {
  constructor (
    private client: NatsClient
  ) {}

  async canProceed (): Promise<boolean> {
    const isConnected = this.client.isConnected()
    if (isConnected) {
      return true
    }

    return await this.client.reconnect()
  }
}
