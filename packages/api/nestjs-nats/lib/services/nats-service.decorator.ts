import type { ClassConstructor } from 'class-transformer'
import type { ServiceConfig } from '@nats-io/services'
import { applyDecorators, Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { getNatsConnectionOptions } from '#src/connections/nats-connection.decorator.js'
import { NamedConnectionOptions } from '#src/connections/nats-connection.manager.js'
import type { CreateServiceConfig } from '#src/nats-application.js'

const NATS_SERVICE_KEY = Symbol('wisemen.nats-service')

export interface NatsServiceConfig extends ServiceConfig {
  /** The NATS client class decorated with `@NatsClient` */
  client?: ClassConstructor<unknown>
}

export type NatsServiceConfigFunction = (config: ConfigService) => NatsServiceConfig

export function NatsService (options: NatsServiceConfigFunction): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SERVICE_KEY, options, target)
    }
  )
}

export function isNatsService (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SERVICE_KEY, target) !== undefined
}

export function getNatsServiceConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): CreateServiceConfig {
  const configFn = Reflect.getMetadata(NATS_SERVICE_KEY, target) as NatsServiceConfigFunction

  if (configFn === undefined) {
    throw new Error(
      `${target.name} is not a valid nats service\nDid you forget to add the @NatsService({...}) decorator?`
    )
  }

  const serviceConfig = configFn(config)
  let connectionOptions: NamedConnectionOptions | undefined

  if (serviceConfig.client !== undefined) {
    connectionOptions = getNatsConnectionOptions(serviceConfig.client, config)
  }

  return { ...serviceConfig, connectionOptions }
}
