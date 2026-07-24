import { BaseJob,  PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { MAIL_QUEUE_NAME } from './mail-queue-name.js'

export interface SendHtmlMailJobData {
  from?: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  subject: string
  data: Record<string, unknown>
  text: string
  html: string
}

@PgBossJob(MAIL_QUEUE_NAME)
export class SendHtmlMailJob extends BaseJob<SendHtmlMailJobData> {
  constructor (data: SendHtmlMailJobData) {
    super(data)
  }
}
