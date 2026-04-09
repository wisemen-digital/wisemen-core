import { Logger } from '@nestjs/common'
import type { NatsConnection, SubscriptionOptions } from '@nats-io/transport-node'
import { NatsSubscription } from './nats-subscription.js'
import type { NamedConnectionOptions } from '#src/clients/nats-connection.manager.js'
import type { NatsConnectionManager } from '#src/clients/nats-connection.manager.js'

export interface NatsSubscriberConfig extends Omit<SubscriptionOptions, 'callback'> {
  connectionOptions?: NamedConnectionOptions
  subject: string
  name: string
}

export class NatsSubscriberManager {
  private subscribers: Map<string, NatsSubscription> = new Map()

  constructor (private connectionManager: NatsConnectionManager) {}

  async createSubscriber (config: NatsSubscriberConfig): Promise<NatsSubscription> {
    const existingSubscriber = this.subscribers.get(config.name)

    if (existingSubscriber !== undefined) {
      return existingSubscriber
    }

    let connection: NatsConnection

    try {
      connection = await this.connectionManager.connect(config.connectionOptions)
    } catch (e) {
      throw new Error(
        'Unable to create subscription connection'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the subscriber options?'
        + `\nError: ${JSON.stringify(e)}`
      )
    }

    const subject = config.subject.replaceAll(/:[\w]+/g, '*')
    const rawSubscription = connection.subscribe(subject, config)
    const subscription = new NatsSubscription(rawSubscription)

    Logger.log(`Subscribed to subject ${config.subject}`, 'NATS')

    this.subscribers.set(config.name, subscription)

    return subscription
  }

  startSubscribers (): void {
    for (const subscriber of this.subscribers.values()) {
      void subscriber.listen()
    }
  }

  async close (): Promise<void> {
    const promises = Array.from(this.subscribers.values()).map(subscription => subscription.close())

    await Promise.allSettled(promises)
  }
}
