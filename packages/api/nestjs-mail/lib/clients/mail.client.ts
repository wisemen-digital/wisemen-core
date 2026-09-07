import { exhaustiveCheck } from '../utils/exhaustive-check.js'

export enum MailFileExtension {
  PDF = 'pdf',
  CSV = 'csv'
}

export interface MailAttachment {
  file: { name: string, ext: MailFileExtension }
  buffer: Buffer
}

export interface SendMailOptions {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  from?: string
  subject: string
  text?: string
  html?: string
  attachments?: MailAttachment[]
  replyTo?: string
}

export interface SentMail {
  /** Provider-specific identifier used to track the sent email. */
  id: string
  /** Addresses represented by this provider identifier. */
  recipients: string[]
}

export abstract class MailClient {
  abstract sendMail (sendMailOptions: SendMailOptions): Promise<SentMail[]>

  protected getRecipients (options: SendMailOptions): string[] {
    return [options.to, options.cc, options.bcc]
      .filter((recipients): recipients is string | string[] => recipients !== undefined)
      .flat()
  }

  protected getMimeTypeForAttachmentExt (ext: MailFileExtension): string {
    switch (ext) {
      case MailFileExtension.CSV:
        return 'text/csv'
      case MailFileExtension.PDF:
        return 'application/pdf'
      default:
        exhaustiveCheck(ext)
    }
  }
}
