import { DynamicModule, Module, Provider } from '@nestjs/common'
import { HANDLEBARS_MODULE_OPTIONS } from './handlebars.module-definitions.js'
import type { HandlebarsModuleAsyncOptions, HandlebarsModuleOptions } from './handlebars.module-options.js'
import { HandlebarsRenderer } from './handlebars.renderer.js'

@Module({})
export class HandlebarsModule {
  static forRoot (options: HandlebarsModuleOptions): DynamicModule {
    return this.forRootAsync({
      useFactory: () => options
    })
  }

  static forRootAsync (options: HandlebarsModuleAsyncOptions): DynamicModule {
    return {
      module: HandlebarsModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        HandlebarsRenderer
      ],
      exports: [
        HandlebarsRenderer
      ]
    }
  }

  private static createOptionsProvider (options: HandlebarsModuleAsyncOptions): Provider {
    return {
      provide: HANDLEBARS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }
}
