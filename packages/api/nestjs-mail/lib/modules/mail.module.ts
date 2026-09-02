import { DynamicModule, Module, Provider } from '@nestjs/common'
import { HANDLEBARS_MODULE_OPTIONS, HandlebarsRenderer, type HandlebarsModuleOptions } from '@wisemen/nestjs-handlebars'
import { createMailClient } from '../clients/mail-client.factory.js'
import { MailClient } from '../clients/mail.client.js'
import { MAIL_MODULE_OPTIONS } from './mail.module-definitions.js'
import type { MailModuleAsyncOptions, MailModuleOptions } from './mail.module-options.js'
import { PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { SendHtmlMailJob } from '../queue/send-html-mail.job.js'
import { SendTemplateMailJob } from '../queue/send-template-mail.job.js'


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
        this.createHandlebarsOptionsProvider(),
        this.createRegisterQueueNameProvider(),
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

  private static createHandlebarsOptionsProvider (): Provider {
    return {
      provide: HANDLEBARS_MODULE_OPTIONS,
      useFactory: (options: MailModuleOptions): HandlebarsModuleOptions => ({
        templateRootPath: options.templateRootPath
      }),
      inject: [MAIL_MODULE_OPTIONS]
    }
  }

  private static createRegisterQueueNameProvider (): Provider {
    return {
      provide: 'wisemen.register-mail-queue-name',
      inject: [MAIL_MODULE_OPTIONS],
      useFactory: (options: MailModuleOptions) => {
        PgBossJob(options.queueName)(SendHtmlMailJob)
        PgBossJob(options.queueName)(SendTemplateMailJob)
        return true
      },
    }
  }
}
