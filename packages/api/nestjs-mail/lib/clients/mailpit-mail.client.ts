import { Injectable } from '@nestjs/common'
import { MailpitClient, type MailpitAttachmentRequest, type MailpitEmailAddressRequest } from 'mailpit-api'
import { MailUnavailableError } from '../errors/mail-unavailable.error.js'
import type { MailPitMailClientOptions } from '../modules/mail.module-options.js'
import { MailClient, type MailAttachment, type SendMailOptions } from './mail.client.js'

@Injectable()
export class MailPitMailClient extends MailClient {
  private _client?: MailpitClient
  private defaultFrom: string
  private tag?: string

  constructor (
    options: MailPitMailClientOptions
  ) {
    super()

    this.defaultFrom = options.defaultFrom ?? 'test@wisemen.digital'
    this.tag = options.tag
    this._client = new MailpitClient(options.url, { auth: options.auth })
  }

  get client (): MailpitClient {
    if (this._client == null) {
      throw new MailUnavailableError('MailPit client is not configured')
    }

    return this._client
  }

  async sendMail (options: SendMailOptions): Promise<void> {
    await this.client.sendMessage({
      From: { Email: options.from ?? this.defaultFrom },
      To: this.mapToEmailAddressRequests(options.to),
      Cc: options.cc !== undefined ? this.mapToEmailAddressRequests(options.cc) : undefined,
      Bcc: options.bcc !== undefined ? this.mapToEmails(options.bcc) : undefined,
      Subject: options.subject,
      Text: options.text,
      HTML: options.html,
      ReplyTo: options.replyTo !== undefined
        ? this.mapToEmailAddressRequests(options.replyTo)
        : undefined,
      Attachments: options.attachments !== undefined
        ? this.mapAttachments(options.attachments)
        : undefined,
      Tags: this.tag !== undefined ? [this.tag] : undefined
    })
  }

  private mapToEmailAddressRequests (value: string | string[]): MailpitEmailAddressRequest[] {
    const emails = Array.isArray(value) ? value : [value]
    return emails.map(email => ({ Email: email }))
  }

  private mapToEmails (value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value]
  }

  private mapAttachments (attachments: MailAttachment[]): MailpitAttachmentRequest[] {
    return attachments.map(attachment => ({
      Filename: attachment.file.name,
      Content: attachment.buffer.toString('base64'),
      ContentType: this.getMimeTypeForAttachmentExt(attachment.file.ext)
    }))
  }
}
