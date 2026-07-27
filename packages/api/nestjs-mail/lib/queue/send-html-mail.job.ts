import { BaseJob } from '@wisemen/pgboss-nestjs-job'

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

export class SendHtmlMailJob extends BaseJob<SendHtmlMailJobData> {
  constructor (data: SendHtmlMailJobData) {
    super(data)
  }
}
