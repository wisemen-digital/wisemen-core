import type { ModuleMetadata } from '@nestjs/common'

/**
 * Configuration for `MailQueueModule.forRoot(...)`.
 */
export interface MailQueueModuleOptions {
  /**
   * Modules imported into the queue module so the mail job handlers can
   * resolve dependencies such as `MailClient` and `HandlebarsRenderer`.
   */
  imports?: ModuleMetadata['imports']
  /**
   * The pgboss queue name on which the jobs will be declared.
   */
  queueName: string
}
