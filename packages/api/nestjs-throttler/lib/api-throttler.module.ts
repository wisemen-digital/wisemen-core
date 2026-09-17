import { Module, type DynamicModule, type FactoryProvider, type ModuleMetadata } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import {
  ThrottlerModule,
  type ThrottlerModuleOptions,
  type ThrottlerOptions,
  type ThrottlerStorage
} from '@nestjs/throttler'
import {
  API_DEFAULT_THROTTLE_LIMIT,
  API_DEFAULT_THROTTLE_TTL
} from './api-throttler.constant.js'
import { UserThrottlerGuard } from './user-throttler.guard.js'
import { UserThrottlerContext } from './user-throttler.context.js'

export interface ApiThrottlerOptions {
  /**
   * Throttler configuration.
   * TTL defaults to 1 minute.
   * Limit defaults to 120 requests.
   */
  throttler?: Partial<ThrottlerOptions>

  /**
   * Storage used to share throttler state.
   * When omitted, the in-memory storage from `@nestjs/throttler` is used.
   */
  storage?: ThrottlerStorage
}

/** Async registration options for ApiThrottlerModule */
export interface ApiThrottlerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<ApiThrottlerOptions> | ApiThrottlerOptions
  inject?: FactoryProvider['inject']
}

@Module({})
export class ApiThrottlerModule {
  static forRoot (options: ApiThrottlerOptions = {}): DynamicModule {
    return createApiThrottlerModuleDefinition(
      ThrottlerModule.forRoot(createThrottlerModuleOptions(options))
    )
  }

  static forRootAsync (options: ApiThrottlerAsyncOptions): DynamicModule {
    return createApiThrottlerModuleDefinition(
      ThrottlerModule.forRootAsync({
        imports: options.imports,
        inject: options.inject,
        useFactory: async (...args: unknown[]) =>
          createThrottlerModuleOptions(await options.useFactory(...args))
      })
    )
  }
}

export function createThrottlerModuleOptions (
  options: ApiThrottlerOptions
): ThrottlerModuleOptions {
  const throttler = options.throttler ?? {}

  return {
    throttlers: [{
      ...throttler,
      ttl: throttler.ttl ?? API_DEFAULT_THROTTLE_TTL,
      limit: throttler.limit ?? API_DEFAULT_THROTTLE_LIMIT
    }],
    ...(options.storage === undefined ? {} : { storage: options.storage })
  }
}

function createApiThrottlerModuleDefinition (
  throttlerModule: DynamicModule
): DynamicModule {
  return {
    module: ApiThrottlerModule,
    imports: [throttlerModule],
    providers: [
      UserThrottlerContext,
      {
        provide: APP_GUARD,
        useClass: UserThrottlerGuard
      }
    ],
    exports: [UserThrottlerContext]
  }
}
