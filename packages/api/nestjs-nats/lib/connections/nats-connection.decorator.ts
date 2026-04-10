import type { ClassConstructor } from 'class-transformer'
import type { ConfigService } from '@nestjs/config'
import type { NamedConnectionOptions } from './nats-connection.manager.js'

const NATS_CLIENT_KEY = Symbol('wisemen.nats-connection')

export type NatsConnectionConfigFunction = (configService: ConfigService) => NamedConnectionOptions

export function NatsConnection (options: NatsConnectionConfigFunction): ClassDecorator {
  return ((target: ClassConstructor<unknown>): void => {
    Reflect.defineMetadata(NATS_CLIENT_KEY, options, target)
  }) as ClassDecorator
}

export function getNatsConnectionOptions (
  client: ClassConstructor<unknown>,
  config: ConfigService
): NamedConnectionOptions {
  const options = Reflect.getMetadata(NATS_CLIENT_KEY, client) as NatsConnectionConfigFunction

  if (options === undefined) {
    throw new Error(
      `${client.name} is not a valid nats client\nDid you forget to add the @NatsClient({...}) decorator?`
    )
  }

  return options(config)
}
