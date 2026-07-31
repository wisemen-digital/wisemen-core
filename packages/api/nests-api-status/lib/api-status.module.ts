import { DynamicModule, Module, type Provider } from '@nestjs/common'
import { API_STATUS_MODULE_OPTIONS } from './api-status.constants.js'
import { createApiStatusController } from './api-status.controller.js'
import type { ApiStatusControllerOptions, ApiStatusModuleAsyncOptions, ApiStatusModuleOptions } from './api-status.module-options.js'
import { resolveApiStatusControllerOptions } from './api-status.module-options.js'

@Module({})
export class ApiStatusModule {
  static forRoot (options: ApiStatusModuleOptions & ApiStatusControllerOptions): DynamicModule {
    const controllerOptions = resolveApiStatusControllerOptions(options)
    const controller = createApiStatusController(controllerOptions)

    return {
      module: ApiStatusModule,
      controllers: [controller],
      providers: [
        {
          provide: API_STATUS_MODULE_OPTIONS,
          useValue: this.pickOptions(options)
        }
      ]
    }
  }

  static forRootAsync (options: ApiStatusModuleAsyncOptions): DynamicModule {
    const controllerOptions = resolveApiStatusControllerOptions(options.controller)
    const controller = createApiStatusController(controllerOptions)

    return {
      module: ApiStatusModule,
      imports: options.imports ?? [],
      controllers: [controller],
      providers: [
        this.createAsyncOptionsProvider(options)
      ]
    }
  }

  private static createAsyncOptionsProvider (options: ApiStatusModuleAsyncOptions): Provider {
    return {
      provide: API_STATUS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static pickOptions (options: ApiStatusModuleOptions): ApiStatusModuleOptions {
    return {
      environment: options.environment,
      commit: options.commit,
      version: options.version,
      timestamp: options.timestamp
    }
  }
}
