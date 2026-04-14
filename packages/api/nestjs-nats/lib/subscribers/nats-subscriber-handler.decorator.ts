import type { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { getNatsSubscriberConfig } from './nats-subscriber.decorator.js'
import type { NatsSubscriberConfig } from './nats-subscriber.manager.js'

const NATS_SUBSCRIBER_HANDLER_KEY = Symbol('wisemen.nats-subscriber-handler')

/**
 * @param subscriber a class annotated with `@NatsSubscriber`
 */
export function NatsSubscriberHandler (subscriber: ClassConstructor<unknown>): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SUBSCRIBER_HANDLER_KEY, subscriber, target)
    }
  )
}

export function isNatsSubscriberHandler (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SUBSCRIBER_HANDLER_KEY, target) !== undefined
}

export function getNatsSubscriberHandlerConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): NatsSubscriberConfig {
  const subscriberClass = Reflect.getMetadata(
    NATS_SUBSCRIBER_HANDLER_KEY,
    target
  ) as ClassConstructor<unknown>

  if (subscriberClass === undefined) {
    throw new Error(
      `${target.name} is not a valid nats subscriber handler\n`
      + `Did you forget to add the @NatsSubscriber({...}) decorator?`
    )
  }

  return getNatsSubscriberConfig(subscriberClass, config)
}
