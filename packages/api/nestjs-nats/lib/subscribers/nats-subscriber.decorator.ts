import type { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'
import type { SubscriptionOptions } from '@nats-io/transport-node'
import type { ConfigService } from '@nestjs/config'
import type { NatsSubscriberConfig } from './nats-subscriber.manager.js'
import { NatsSubscriberHandler } from './nats-subscriber-handler.decorator.js'
import { getNatsConnectionOptions } from '#src/connections/nats-connection.decorator.js'

const NATS_SUBSCRIBER_KEY = Symbol('wisemen.nats-subscriber')

export interface NatsSubscriptionOptions extends Omit<SubscriptionOptions, 'callback'> {
  /** The NATS connection class decorated with `@NatsConnection` */
  connection: ClassConstructor<unknown>
  subject: string
  name?: string
}

export type NatsSubscriberConfigFunction = (configService: ConfigService) => NatsSubscriptionOptions

export function NatsSubscriber (options: NatsSubscriberConfigFunction): ClassDecorator {
  return applyDecorators(
    (target: ClassConstructor<unknown>): void => {
      const handlerDecorator = NatsSubscriberHandler(target)

      handlerDecorator(target)
    },
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SUBSCRIBER_KEY, options, target)
    }
  )
}

export function isNatsSubscriber (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SUBSCRIBER_KEY, target) !== undefined
}

export function getNatsSubscriberConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): NatsSubscriberConfig {
  const configFn = Reflect.getMetadata(
    NATS_SUBSCRIBER_KEY,
    target
  ) as NatsSubscriberConfigFunction

  if (configFn === undefined) {
    throw new Error(
      `${target.name} is not a valid nats subscriber\n`
      + `Did you forget to add the @NatsSubscriber({...}) decorator?`
    )
  }

  const subscriberConfig = configFn(config)
  const connectionOptions = getNatsConnectionOptions(subscriberConfig.connection, config)
  const name = subscriberConfig.name ?? target.name

  return { ...subscriberConfig, connectionOptions, name }
}
