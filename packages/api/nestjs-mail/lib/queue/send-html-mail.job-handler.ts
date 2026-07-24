import { Injectable } from '@nestjs/common'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { MailClient } from '../clients/mail.client.js'
import { SendHtmlMailJob, type SendHtmlMailJobData } from './send-html-mail.job.js'

@Injectable()
@PgBossJobHandler(SendHtmlMailJob)
export class SendHtmlMailJobHandler extends JobHandler<SendHtmlMailJob> {
  constructor (
    private mailClient: MailClient
  ) {
    super()
  }

  async run (mail: SendHtmlMailJobData): Promise<void> {
    await this.mailClient.sendMail({
      to: mail.to,
      cc: mail.cc,
      bcc: mail.bcc,
      from: mail.from,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html
    })
  }
}
