import { BaseJob, type BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { MAIL_QUEUE_NAME } from './mail-queue-name.js'

export interface SendHtmlMailJobData extends BaseJobData {
  from?: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  subject: string
  data: BaseJobData
  text: string
  html: string
}

@PgBossJob(MAIL_QUEUE_NAME)
export class SendHtmlMailJob extends BaseJob<SendHtmlMailJobData> {
  constructor (data: SendHtmlMailJobData) {
    super(data)
  }
}
