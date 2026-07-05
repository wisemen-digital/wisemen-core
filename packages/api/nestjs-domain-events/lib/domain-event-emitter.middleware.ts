import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import type { DomainEvent } from './domain-event.js'

export const DOMAIN_EVENT_EMITTER_MIDDLEWARE = Symbol('wisemen.domain-event-emitter-middleware')

export type DomainEventEmitFunction = () => Promise<void>

export type DomainEventEmitterMiddleware = <Event extends DomainEvent = DomainEvent>(
  emit: DomainEventEmitFunction,
  events: Event[]
) => Promise<void>

export interface DomainEventEmitterModuleOptions {
  middleware?: DomainEventEmitterMiddleware
}

export interface DomainEventEmitterModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject']
  useFactory: (
    ...args: unknown[]
  ) => Promise<DomainEventEmitterModuleOptions> | DomainEventEmitterModuleOptions
}
