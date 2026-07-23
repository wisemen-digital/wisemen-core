import { BaseJob, type BaseJobData, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { MAIL_QUEUE_NAME } from './mail-queue-name.js'

export interface SendTemplateMailJobData extends BaseJobData {
  from?: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  subject: string
  data: BaseJobData
  textHbsFilePath: string
  htmlHbsFilePath: string
}

@PgBossJob(MAIL_QUEUE_NAME)
export class SendTemplateMailJob extends BaseJob<SendTemplateMailJobData> {
  constructor (data: SendTemplateMailJobData) {
    super(data)
  }
}
