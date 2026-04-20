import { Logger } from '@nestjs/common'
import type { SubscriptionOptions } from '@nats-io/transport-node'
import { NatsSubscription } from './nats-subscription.js'
import { NamedConnectionOptions, NatsConnectionManager } from '#src/connections/nats-connection.manager.js'

export interface NatsSubscriberConfig extends Omit<SubscriptionOptions, 'callback'> {
  connectionOptions: NamedConnectionOptions
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

    const connection = await this.connectionManager.connect(config.connectionOptions)
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
