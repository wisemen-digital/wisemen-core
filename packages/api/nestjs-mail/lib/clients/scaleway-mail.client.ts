import { Injectable } from '@nestjs/common'
import { MailApiError } from '../errors/mail-api.error.js'
import type { ScalewayMailClientOptions } from '../modules/mail.module-options.js'
import { MailClient, type SendMailOptions, type SentMail } from './mail.client.js'

/** @link https://www.scaleway.com/en/developers/api/transactional-email/~schemas#scaleway-transactional-email-v1alpha1-email */
interface ScalewayCreateEmailResponse {
  emails: Array<{
    id: string
    // eslint-disable-next-line @typescript-eslint/naming-convention
    mail_rcpt: string
  }>
}

@Injectable()
export class ScalewayMailClient extends MailClient {
  private region: string
  private projectId: string
  private from: string
  private headers: Record<string, string>

  constructor (
    options: ScalewayMailClientOptions
  ) {
    super()
    this.region = options.region ?? 'fr-par'
    this.projectId = options.projectId
    this.from = options.from
    this.headers = {
      'X-Auth-Token': options.apiKey,
      'Content-Type': 'application/json'
    }
  }

  async sendMail (options: SendMailOptions): Promise<SentMail[]> {
    const response = await fetch(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${this.region}/emails`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.buildPayload(options))
    })

    if (!response.ok) {
      const body = await response.text()
      throw new MailApiError('Scaleway', response.status, body)
    }

    const body = await response.json() as ScalewayCreateEmailResponse
    return body.emails.map(email => ({ id: email.id, recipients: [email.mail_rcpt] }))
  }

  private buildPayload (options: SendMailOptions): object {
    const from = { email: options.from ?? this.from }
    const to = [options.to].flat().map(email => ({ email }))
    const cc = options.cc === undefined
      ? undefined
      : [options.cc].flat().map(email => ({ email }))
    const bcc = options.bcc === undefined
      ? undefined
      : [options.bcc].flat().map(email => ({ email }))
    const attachments = options.attachments?.map(attachment => ({
      name: `${attachment.file.name}.${attachment.file.ext}`,
      content: attachment.buffer.toString('base64'),
      type: this.getMimeTypeForAttachmentExt(attachment.file.ext)
    }))
    const additionalHeaders = options.replyTo !== undefined
      ? [{ key: 'Reply-To', value: options.replyTo }]
      : undefined

    return {
      from,
      to,
      cc,
      bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments,
      additional_headers: additionalHeaders,
      project_id: this.projectId
    }
  }
}
