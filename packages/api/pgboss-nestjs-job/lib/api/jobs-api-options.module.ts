import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { JOBS_API_MODULE_OPTIONS } from './jobs-api.constants.js'
import type { JobsApiModuleAsyncOptions, JobsApiModuleOptions } from './jobs-api.module-options.js'

export interface ResolvedJobsApiModuleOptions extends JobsApiModuleOptions {
  queueNames: string[]
}

@Module({})
export class JobsApiOptionsModule {
  static forRootAsync (options: JobsApiModuleAsyncOptions, queueNames: string[]): DynamicModule {
    const provider = this.createOptionsProvider(options, queueNames)

    return {
      module: JobsApiOptionsModule,
      imports: options.imports ?? [],
      providers: [provider],
      exports: [provider]
    }
  }

  private static createOptionsProvider (
    options: JobsApiModuleAsyncOptions,
    queueNames: string[]
  ): Provider {
    return {
      provide: JOBS_API_MODULE_OPTIONS,
      useFactory: async (...args: unknown[]) => {
        const moduleOptions = await options.useFactory(...args)

        return {
          ...moduleOptions,
          queueNames
        }
      },
      inject: options.inject ?? []
    }
  }
}
