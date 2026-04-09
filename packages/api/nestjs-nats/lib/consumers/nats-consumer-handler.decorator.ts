import type { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { getNatsConsumerConfig } from './nats-consumer.decorator.js'
import type { NatsConsumerConfig } from './nats-consumer.manager.js'

const NATS_CONSUMER_HANDLER_KEY = Symbol('wisemen.nats-consumer-handler')

/**
 * @param consumer a class annotated with `@NatsConsumer`
 */
export function NatsConsumerHandler (consumer: ClassConstructor<unknown>): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_CONSUMER_HANDLER_KEY, consumer, target)
    }
  )
}

export function isNatsConsumerHandler (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_CONSUMER_HANDLER_KEY, target) !== undefined
}

export function getNatsConsumerHandlerConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): NatsConsumerConfig {
  const consumerClass = Reflect.getMetadata(
    NATS_CONSUMER_HANDLER_KEY,
    target
  ) as ClassConstructor<unknown>

  if (consumerClass === undefined) {
    throw new Error(
      `${target.name} is not a valid nats consumer handler\n`
      + `Did you forget to add the @NatsConsumer({...}) decorator?`
    )
  }

  return getNatsConsumerConfig(consumerClass, config)
}
