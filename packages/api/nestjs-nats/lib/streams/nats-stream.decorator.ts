import type { ClassConstructor } from 'class-transformer'
import type { ConfigService } from '@nestjs/config'
import type { RetentionPolicy } from '@nats-io/jetstream'
import { getNatsConnectionOptions } from '#src/connections/nats-connection.decorator.js'
import { NamedConnectionOptions } from '#src/connections/nats-connection.manager.js'
import type { CreateStreamConfig } from '#src/nats-application.js'

const NATS_STREAM_KEY = Symbol('wisemen.nats-stream')

type LimitsStreamConfig = Omit<CreateStreamConfig, 'connectionOptions'> & {
  connection?: ClassConstructor<unknown>
  retention: typeof RetentionPolicy.Limits
} & Required<Pick<CreateStreamConfig, 'retention' | 'max_age' | 'max_bytes' | 'max_msgs'>>

export type NatsLimitsStreamConfigFunction = (configService: ConfigService) => LimitsStreamConfig

type StreamConfig = Omit<CreateStreamConfig, 'connectionOptions'> & {
  connection?: ClassConstructor<unknown>
  retention: Exclude<RetentionPolicy, typeof RetentionPolicy.Limits>
} & Required<Pick<CreateStreamConfig, 'retention'>>

export type NatsStreamConfigFunction = (configService: ConfigService) => StreamConfig

export function NatsStream (options: NatsLimitsStreamConfigFunction): ClassDecorator
export function NatsStream (options: NatsStreamConfigFunction): ClassDecorator
export function NatsStream (
  options: NatsLimitsStreamConfigFunction | NatsStreamConfigFunction
): ClassDecorator {
  return ((target: ClassConstructor<unknown>): void => {
    Reflect.defineMetadata(NATS_STREAM_KEY, options, target)
  }) as ClassDecorator
}

export function getNatsStreamConfig (
  client: ClassConstructor<unknown>,
  config: ConfigService
): CreateStreamConfig {
  const configFn = Reflect.getMetadata(NATS_STREAM_KEY, client) as
    | NatsLimitsStreamConfigFunction
    | NatsStreamConfigFunction

  if (configFn === undefined) {
    throw new Error(
      `${client.name} is not a valid nats stream\nDid you forget to add the @NatsStream({...}) decorator?`
    )
  }

  const streamConfig = configFn(config)
  let connectionOptions: NamedConnectionOptions | undefined = undefined

  if (streamConfig.connection) {
    connectionOptions = getNatsConnectionOptions(streamConfig.connection, config)
  }

  return { ...streamConfig, connectionOptions }
}
