import { type DynamicModule, Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './http-exception-filter.module-definition.js'
import { HttpExceptionFilter } from './http-exception.filter.js'

@Module({})
export class HttpExceptionFilterModule extends ConfigurableModuleClass {
  static override forRoot (options: typeof OPTIONS_TYPE): DynamicModule {
    return extendHttpExceptionFilterModule(super.forRoot(options))
  }

  static override forRootAsync (options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return extendHttpExceptionFilterModule(super.forRootAsync(options))
  }
}

function extendHttpExceptionFilterModule (moduleDefinition: DynamicModule): DynamicModule {
  return {
    ...moduleDefinition,
    providers: [
      ...(moduleDefinition.providers ?? []),
      HttpExceptionFilter,
      {
        provide: APP_FILTER,
        useExisting: HttpExceptionFilter
      }
    ],
    exports: [
      ...(moduleDefinition.exports ?? []),
      HttpExceptionFilter
    ]
  }
}
