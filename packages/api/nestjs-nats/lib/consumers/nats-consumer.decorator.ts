import type { ClassConstructor } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'
import type { ConsumerConfig } from '@nats-io/jetstream'
import type { ConfigService } from '@nestjs/config'
import { NatsConsumerHandler } from './nats-consumer-handler.decorator.js'
import type { NatsConsumerConfig as CreateNatsConsumerConfig } from './nats-consumer.manager.js'
import { getNatsConnectionOptions } from '#src/connections/nats-connection.decorator.js'
import { NamedConnectionOptions } from '#src/connections/nats-connection.manager.js'

const NATS_CONSUMER_KEY = Symbol('wisemen.nats-consumer')

export interface NatsConsumerConfig extends Omit<ConsumerConfig, 'callback'> {
  /** The NATS client class decorated with `@NatsClient` */
  client?: ClassConstructor<unknown>
  streamName: string
}

export type NatsConsumerConfigFunction = (configService: ConfigService) => NatsConsumerConfig

export function NatsConsumer (options: NatsConsumerConfigFunction): ClassDecorator {
  return applyDecorators(
    (target: ClassConstructor<unknown>): void => {
      const handlerDecorator = NatsConsumerHandler(target)

      handlerDecorator(target)
    },
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_CONSUMER_KEY, options, target)
    }
  )
}

export function isNatsConsumer (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_CONSUMER_KEY, target) !== undefined
}

export function getNatsConsumerConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): CreateNatsConsumerConfig {
  const configFn = Reflect.getMetadata(NATS_CONSUMER_KEY, target) as NatsConsumerConfigFunction

  if (configFn === undefined) {
    throw new Error(
      `${target.name} is not a valid nats consumer\n`
      + `Did you forget to add the @NatsConsumer({...}) decorator?`
    )
  }

  const consumerConfig = configFn(config)
  const name = consumerConfig.name ?? target.name
  let connectionOptions: NamedConnectionOptions | undefined = undefined

  if (consumerConfig.client) {
    connectionOptions = getNatsConnectionOptions(consumerConfig.client, config)
  }

  return { ...consumerConfig, name, connectionOptions }
}
