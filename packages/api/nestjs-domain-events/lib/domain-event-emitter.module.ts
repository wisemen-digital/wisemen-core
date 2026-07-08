// oxlint-disable typescript-eslint(no-unsafe-argument), typescript-eslint(no-unsafe-member-access), typescript-eslint(no-unsafe-call), typescript-eslint(no-unsafe-assignment), typescript-eslint(no-explicit-any)
import {
  Global,
  Module,
  type DynamicModule,
  type OnApplicationBootstrap,
  type Provider,
  type Type
} from '@nestjs/common'
import { type EventsMap, SUBSCRIBE_KEY } from './subscribe.decorator.js'
import { DomainEventEmitter } from './domain-event-emitter.js'
import { SUBSCRIBE_ALL_KEY, type SubscribeAllMethodNames } from './subscribe-all.decorator.js'
import {
  DOMAIN_EVENT_EMITTER_MIDDLEWARE,
  type DomainEventEmitterModuleAsyncOptions,
  type DomainEventEmitterModuleOptions
} from './domain-event-emitter.middleware.js'
import { ProvidersExplorer } from './providers/providers-explorer.js'
import { ProvidersExplorerModule } from './providers/providers-explorer.module.js'

const DOMAIN_EVENT_EMITTER_MODULE_OPTIONS = Symbol('wisemen.domain-event-emitter-module-options')

@Global()
@Module({
  imports: [ProvidersExplorerModule],
  providers: [DomainEventEmitter],
  exports: [DomainEventEmitter]
})
export class DomainEventEmitterModule implements OnApplicationBootstrap {
  static forRoot (options: DomainEventEmitterModuleOptions = {}): DynamicModule {
    return {
      module: DomainEventEmitterModule,
      providers: this.createMiddlewareProviders(options)
    }
  }

  static forRootAsync (options: DomainEventEmitterModuleAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: DOMAIN_EVENT_EMITTER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }

    const middlewareProvider: Provider = {
      provide: DOMAIN_EVENT_EMITTER_MIDDLEWARE,
      useFactory: (moduleOptions: DomainEventEmitterModuleOptions) => moduleOptions.middleware,
      inject: [DOMAIN_EVENT_EMITTER_MODULE_OPTIONS]
    }

    return {
      module: DomainEventEmitterModule,
      imports: options.imports,
      providers: [optionsProvider, middlewareProvider]
    }
  }

  constructor (
    private providerExplorer: ProvidersExplorer,
    private emitter: DomainEventEmitter
  ) {}

  onApplicationBootstrap () {
    for (const { providerClass, providerInstance } of this.providerExplorer.providers) {
      this.addEventSubscribers(providerClass, providerInstance)
      this.addGlobalSubscribers(providerClass, providerInstance)
    }
  }

  private addEventSubscribers (providerClass: Type<unknown>, instance: any) {
    const eventMap = this.extractEventMap(providerClass)

    if (eventMap === undefined) {
      return
    }

    for (const [eventType, methodNames] of eventMap.entries()) {
      for (const methodName of methodNames) {
        const observer = instance[methodName]
        const boundObserver = observer.bind(instance) 
        this.emitter.addSubscriber(eventType, boundObserver)
      }
    }
  }

  private addGlobalSubscribers (providerClass: Type<unknown>, instance: any) {
    const globalSubscriberMethodNames = this.extractGlobalSubscribers(providerClass)

    for (const methodName of globalSubscriberMethodNames) {
      const observer = instance[methodName]

      this.emitter.addGlobalSubscriber(observer.bind(instance))
    }
  }

  private extractEventMap (providerClass: Type<unknown>) {
    return Reflect.getMetadata(
      SUBSCRIBE_KEY,
      providerClass.prototype
    ) as EventsMap | undefined
  }

  private extractGlobalSubscribers (providerClass: Type<unknown>) {
    return Reflect.getMetadata(
      SUBSCRIBE_ALL_KEY,
      providerClass.prototype
    ) as SubscribeAllMethodNames ?? []
  }

  private static createMiddlewareProviders (options: DomainEventEmitterModuleOptions): Provider[] {
    if (options.middleware === undefined) {
      return []
    }

    return [{
      provide: DOMAIN_EVENT_EMITTER_MIDDLEWARE,
      useValue: options.middleware
    }]
  }
}
