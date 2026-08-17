import { DynamicModule, Global, Inject, Injectable, InjectionToken, Module, OptionalFactoryDependency, type ModuleMetadata, type OnModuleInit, type Provider } from '@nestjs/common'
import { BASIC_AUTH_DEFINITIONS, BasicAuthDefinitions } from './basic-auth.types.js'
import { BasicAuthGuard } from './basic-auth.guard.js'
import { BasicAuthRegistry } from './basic-auth.registry.js'
import { BasicAuthService } from './basic-auth.service.js'

const BASIC_AUTH_MODULE_DEFINITIONS = Symbol('wisemen.basic-auth-module-definitions')

export interface BasicAuthDefinitionsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  useFactory: (...dependencies: unknown[]) => BasicAuthDefinitions | Promise<BasicAuthDefinitions>
}

@Injectable()
class BasicAuthDefinitionsRegistration implements OnModuleInit {
  constructor (
    @Inject(BASIC_AUTH_MODULE_DEFINITIONS)
    private readonly definitions: BasicAuthDefinitions,
    private readonly registry: BasicAuthRegistry
  ) { }

  onModuleInit (): void {
    this.registry.register(this.definitions)
  }
}

@Global()
@Module({})
class BasicAuthRootModule { }

@Module({})
class BasicAuthFeatureModule { }

export class BasicAuthModule {
  static forRoot (definitions: BasicAuthDefinitions = {}): DynamicModule {
    return this.createRootModule(
      {
        provide: BASIC_AUTH_MODULE_DEFINITIONS,
        useValue: definitions
      },
      []
    )
  }

  static forRootAsync (options: BasicAuthDefinitionsAsyncOptions): DynamicModule {
    return this.createRootModule(
      this.createDefinitionsProvider(options),
      options.imports ?? []
    )
  }

  static forFeature (definitions: BasicAuthDefinitions): DynamicModule {
    return {
      module: BasicAuthFeatureModule,
      providers: [
        {
          provide: BASIC_AUTH_MODULE_DEFINITIONS,
          useValue: definitions
        },
        BasicAuthDefinitionsRegistration
      ]
    }
  }

  static forFeatureAsync (options: BasicAuthDefinitionsAsyncOptions): DynamicModule {
    return {
      module: BasicAuthFeatureModule,
      imports: options.imports ?? [],
      providers: [
        this.createDefinitionsProvider(options),
        BasicAuthDefinitionsRegistration
      ]
    }
  }

  private static createRootModule (
    definitionsProvider: Provider,
    imports: NonNullable<ModuleMetadata['imports']>
  ): DynamicModule {
    return {
      module: BasicAuthRootModule,
      imports,
      providers: [
        definitionsProvider,
        BasicAuthRegistry,
        {
          provide: BASIC_AUTH_DEFINITIONS,
          inject: [BasicAuthRegistry],
          useFactory: (registry: BasicAuthRegistry): BasicAuthDefinitions => registry.definitions
        },
        BasicAuthService,
        BasicAuthDefinitionsRegistration,
        BasicAuthGuard
      ],
      exports: [
        BASIC_AUTH_DEFINITIONS,
        BasicAuthService,
        BasicAuthGuard,
        BasicAuthRegistry
      ]
    }
  }

  private static createDefinitionsProvider (options: BasicAuthDefinitionsAsyncOptions): Provider {
    return {
      provide: BASIC_AUTH_MODULE_DEFINITIONS,
      inject: options.inject ?? [],
      useFactory: async (...args: unknown[]) => await options.useFactory(...args)
    }
  }
}



