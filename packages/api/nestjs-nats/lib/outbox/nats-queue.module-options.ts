import { NatsClient } from '../nats.client.js'

/**
 * Synchronous configuration for `NatsQueueModule.forRoot(...)`.
 */
export interface NatsQueueModuleOptions {
  /**
   * The pgboss queue name on which the NATS publish job will be declared.
   */
  queueName: string
  /**
   * Client used by the job handler to publish messages.
   */
  natsClient: NatsClient
}
