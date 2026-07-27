import { DynamicModule, Module } from '@nestjs/common'
import { SendHtmlMailJobHandler } from './send-html-mail.job-handler.js'
import type { MailQueueModuleOptions } from './mail-queue.module-options.js'
import { SendTemplateMailJobHandler } from './send-template-mail.job-handler.js'
import { PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { SendHtmlMailJob } from './send-html-mail.job.js'
import { SendTemplateMailJob } from './send-template-mail.job.js'

@Module({})
export class MailQueueModule {
  /**
   * This method is only intended to be called once per app.
   * Calling multiple times will result in the last queue name winning.
   */
  static forRoot (options: MailQueueModuleOptions): DynamicModule {
    PgBossJob(options.queueName)(SendHtmlMailJob)
    PgBossJob(options.queueName)(SendTemplateMailJob)

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
