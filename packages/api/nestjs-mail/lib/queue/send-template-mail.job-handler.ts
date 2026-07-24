import { Injectable } from '@nestjs/common'
import { HandlebarsRenderer } from '@wisemen/nestjs-handlebars'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { MailClient } from '../clients/mail.client.js'
import { SendTemplateMailJob, type SendTemplateMailJobData } from './send-template-mail.job.js'

@Injectable()
@PgBossJobHandler(SendTemplateMailJob)
export class SendTemplateMailJobHandler extends JobHandler<SendTemplateMailJob> {
  constructor (
    private mailClient: MailClient,
    private handlebarsRenderer: HandlebarsRenderer
  ) {
    super()
  }

  async run (mail: SendTemplateMailJobData): Promise<void> {
    const [html, text] = await Promise.all([
      this.handlebarsRenderer.render(mail.htmlHbsFilePath, mail.data),
      this.handlebarsRenderer.render(mail.textHbsFilePath, mail.data)
    ])

    await this.mailClient.sendMail({
      to: mail.to,
      cc: mail.cc,
      bcc: mail.bcc,
      from: mail.from,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text,
      html
    })
  }
}
