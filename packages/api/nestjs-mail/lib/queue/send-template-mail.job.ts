import { BaseJob } from '@wisemen/pgboss-nestjs-job'

export interface SendTemplateMailJobData {
  from?: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  subject: string
  data: Record<string, unknown>
  textHbsFilePath: string
  htmlHbsFilePath: string
}

export class SendTemplateMailJob extends BaseJob<SendTemplateMailJobData> {
  constructor (data: SendTemplateMailJobData) {
    super(data)
  }
}
