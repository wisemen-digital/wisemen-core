import { Injectable } from '@nestjs/common'
import { MailApiError } from '../errors/mail-api.error.js'
import type { SendGridMailClientOptions } from '../modules/mail.module-options.js'
import { MailClient, type SendMailOptions } from './mail.client.js'

@Injectable()
export class SendGridMailClient extends MailClient {
  private defaultFrom: string
  private headers: Record<string, string>

  constructor (
    options: SendGridMailClientOptions
  ) {
    super()
    this.headers = {
      'Authorization': 'Bearer ' + options.apiToken,
      'Content-Type': 'application/json'
    }
    this.defaultFrom = options.defaultFrom
  }

  async sendMail (options: SendMailOptions): Promise<void> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(this.buildPayload(options))
    })

    if (!response.ok) {
      const body = await response.text()
      throw new MailApiError('SendGrid', response.status, body)
    }
  }

  private buildPayload (options: SendMailOptions): object {
    if (options.html == null && options.text == null) {
      throw new Error('Either html or text content must be provided')
    }

    return {
      personalizations: [
        {
          to: [options.to].flat().map(email => ({ email })),
          subject: options.subject
        }
      ],
      from: {
        email: options.from ?? this.defaultFrom
      },
      reply_to: options.replyTo !== undefined ? { email: options.replyTo } : undefined,
      content: [
        {
          type: 'text/plain',
          value: options.text ?? ''
        },
        {
          type: 'text/html',
          value: options.html ?? ''
        }
      ],
      attachments: options.attachments?.map(attachment => ({
        content: attachment.buffer.toString('base64'),
        filename: `${attachment.file.name}.${attachment.file.ext}`,
        type: this.getMimeTypeForAttachmentExt(attachment.file.ext),
        disposition: 'attachment'
      }))
    }
  }
}
