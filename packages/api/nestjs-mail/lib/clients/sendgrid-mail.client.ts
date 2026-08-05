/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common'
import { MailApiError } from '../errors/mail-api.error.js'
import type { SendGridMailClientOptions } from '../modules/mail.module-options.js'
import { MailClient, type SendMailOptions } from './mail.client.js'

interface SendGridEmailAddress {
  email: string
  name?: string
}

interface SendGridPersonalization {
  to: SendGridEmailAddress[]
  cc?: SendGridEmailAddress[]
  bcc?: SendGridEmailAddress[]
  subject?: string
  headers?: Record<string, string>
  substitutions?: Record<string, string>
  custom_args?: Record<string, string>
  send_at?: number
  dynamic_template_data?: Record<string, unknown>
}

interface SendGridContent {
  type: string
  value: string
}

interface SendGridAttachment {
  content: string
  filename: string
  type?: string
  disposition?: string
  content_id?: string
}

interface SendGridMailSendRequest {
  personalizations: SendGridPersonalization[]
  from: SendGridEmailAddress
  reply_to?: SendGridEmailAddress
  reply_to_list?: SendGridEmailAddress[]
  subject?: string
  content?: SendGridContent[]
  attachments?: SendGridAttachment[]
  template_id?: string
  categories?: string[]
  send_at?: number
  custom_args?: Record<string, string>
  asm?: {
    group_id: number
    groups_to_display?: number[]
  }
  batch_id?: string
  ip_pool_name?: string
  mail_settings?: {
    bypass_list_management?: { enable?: boolean }
    footer?: { enable?: boolean, text?: string, html?: string }
    sandbox_mode?: { enable?: boolean }
  }
  tracking_settings?: {
    click_tracking?: { enable?: boolean, enable_text?: boolean }
    open_tracking?: { enable?: boolean, substitution_tag?: string }
    subscription_tracking?: {
      enable?: boolean
      text?: string
      html?: string
      substitution_tag?: string
    }
  }
}

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

  private buildPayload (options: SendMailOptions): SendGridMailSendRequest {
    if (options.html == null && options.text == null) {
      throw new Error('Either html or text content must be provided')
    }

    const content: SendGridContent[] = []

    if (options.text !== undefined) {
      content.push({
        type: 'text/plain',
        value: options.text
      })
    }

    if (options.html !== undefined) {
      content.push({
        type: 'text/html',
        value: options.html
      })
    }

    return {
      personalizations: [
        {
          to: this.mapEmailAddresses(options.to),
          cc: this.mapEmailAddresses(options.cc), 
          bcc: this.mapEmailAddresses(options.bcc),
          subject: options.subject
        }
      ],
      from: {
        email: options.from ?? this.defaultFrom
      },
      reply_to: options.replyTo !== undefined ? { email: options.replyTo } : undefined,
      content,
      attachments: options.attachments?.map(attachment => ({
        content: attachment.buffer.toString('base64'),
        filename: `${attachment.file.name}.${attachment.file.ext}`,
        type: this.getMimeTypeForAttachmentExt(attachment.file.ext),
        disposition: 'attachment'
      }))
    }
  }

  private mapEmailAddresses (
    value: string | string[] 
  ): SendGridEmailAddress[]
  private mapEmailAddresses (
    value: string | string[] | undefined
  ): SendGridEmailAddress[] | undefined
  private mapEmailAddresses (
    value: string | string[] | undefined
  ): SendGridEmailAddress[] | undefined {
    if(value === undefined) {
      return undefined
    }

    return [value].flat().map(email => ({ email }))
  }
}
