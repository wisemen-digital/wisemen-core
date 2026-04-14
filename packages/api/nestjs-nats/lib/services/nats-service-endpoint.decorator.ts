import type { ClassConstructor } from 'class-transformer'
import { applyDecorators, Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { EndpointOptions } from '@nats-io/services'
import { getNatsServiceConfig } from './nats-service.decorator.js'
import type { CreateServiceConfig, CreateServiceEndpointConfig } from '#src/nats-application.js'

const NATS_SERVICE_ENDPOINT_KEY = Symbol('wisemen.nats-service-endpoint')

interface NatsServiceEndpointDecoratorOptions extends EndpointOptions {
  /** a class annotated with `@NatsService` */
  service: ClassConstructor<unknown>
}

type ConfigFunction = (config: ConfigService) => NatsServiceEndpointDecoratorOptions

export type NatsServiceEndpointDecoratorConfig = Omit<
  CreateServiceEndpointConfig,
  'parameters' | 'callback' | 'event'
>

export function NatsServiceEndpoint (configFn: ConfigFunction): ClassDecorator {
  return applyDecorators(
    Injectable(),
    (target: ClassConstructor<unknown>): void => {
      Reflect.defineMetadata(NATS_SERVICE_ENDPOINT_KEY, configFn, target)
    }
  )
}

export function isNatsServiceEndpoint (target: ClassConstructor<unknown>): boolean {
  return Reflect.getMetadata(NATS_SERVICE_ENDPOINT_KEY, target) !== undefined
}

export function getNatsServiceEndpointConfig (
  target: ClassConstructor<unknown>,
  config: ConfigService
): NatsServiceEndpointDecoratorConfig {
  const configFn = Reflect.getMetadata(NATS_SERVICE_ENDPOINT_KEY, target) as ConfigFunction

  if (configFn === undefined) {
    throw new Error(
      `${target.name} is not a valid nats service endpoint\n`
      + `Did you forget to add the @NatsServiceEndpoint({...}) decorator?`
    )
  }

  const endpointConfig = configFn(config)
  const service: CreateServiceConfig = getNatsServiceConfig(endpointConfig.service, config)

  return { ...endpointConfig, name: target.name, service }
}
