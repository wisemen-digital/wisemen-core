import { DynamicModule, Module } from '@nestjs/common'
import { SendHtmlMailJobHandler } from './send-html-mail.job-handler.js'
import type { MailQueueModuleOptions } from './mail-queue.module-options.js'
import { SendTemplateMailJobHandler } from './send-template-mail.job-handler.js'

@Module({})
export class MailQueueModule {
  static forRoot (options: MailQueueModuleOptions = {}): DynamicModule {
    return {
      module: MailQueueModule,
      imports: options.imports ?? [],
      providers: [
        SendHtmlMailJobHandler,
        SendTemplateMailJobHandler
      ]
    }
  }
}
