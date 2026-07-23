import { DynamicModule, Module, Provider } from '@nestjs/common'
import { createMailClient } from '../clients/mail-client.factory.js'
import { MailClient } from '../clients/mail.client.js'
import { HandlebarsRenderer } from './handlebars.renderer.js'
import { MAIL_MODULE_OPTIONS } from './mail.module-definitions.js'
import type { MailModuleAsyncOptions, MailModuleOptions } from './mail.module-options.js'

@Module({})
export class MailModule {
  static forRoot (options: MailModuleOptions): DynamicModule {
    return this.forRootAsync({
      useFactory: () => options
    })
  }

  static forRootAsync (options: MailModuleAsyncOptions): DynamicModule {
    return {
      module: MailModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        this.createMailClientProvider(),
        HandlebarsRenderer
      ],
      exports: [
        HandlebarsRenderer,
        MailClient
      ]
    }
  }

  private static createOptionsProvider (options: MailModuleAsyncOptions): Provider {
    return {
      provide: MAIL_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static createMailClientProvider (): Provider {
    return {
      provide: MailClient,
      useFactory: (options: MailModuleOptions) => createMailClient(options.client),
      inject: [MAIL_MODULE_OPTIONS]
    }
  }
}
