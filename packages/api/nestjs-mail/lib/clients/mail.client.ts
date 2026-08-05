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

export abstract class MailClient {
  abstract sendMail (sendMailOptions: SendMailOptions): Promise<void>

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
