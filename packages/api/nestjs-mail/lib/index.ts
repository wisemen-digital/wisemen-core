export { createMailClient, mailClientFactory } from './clients/mail-client.factory.js'
export { MailClient, MailFileExtension, type MailAttachment, type SendMailOptions } from './clients/mail.client.js'
export { MailPitMailClient } from './clients/mailpit-mail.client.js'
export { MockMailClient } from './clients/mock-mail.client.js'
export { ScalewayMailClient } from './clients/scaleway-mail.client.js'
export { SendGridMailClient } from './clients/sendgrid-mail.client.js'
export { MailApiError } from './errors/mail-api.error.js'
export { MailUnavailableError } from './errors/mail-unavailable.error.js'
export { MailProvider } from './enums/mail-provider.enum.js'
export { MailModule } from './modules/mail.module.js'
export {
  type MailClientOptions,
  type MailModuleAsyncOptions,
  type MailModuleOptions,
  type MailPitMailClientOptions,
  type MockMailClientOptions,
  type ScalewayMailClientOptions,
  type SendGridMailClientOptions
} from './modules/mail.module-options.js'
export { MAIL_QUEUE_NAME } from './queue/mail-queue-name.js'
export { MailQueueModule } from './queue/mail-queue.module.js'
export { type MailQueueModuleOptions } from './queue/mail-queue.module-options.js'
export { SendHtmlMailJob, type SendHtmlMailJobData } from './queue/send-html-mail.job.js'
export { SendTemplateMailJob, type SendTemplateMailJobData } from './queue/send-template-mail.job.js'
