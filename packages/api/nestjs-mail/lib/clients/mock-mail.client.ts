import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { MailClient, type SendMailOptions, type SentMail } from './mail.client.js'

@Injectable()
export class MockMailClient extends MailClient {
  async sendMail (params: SendMailOptions): Promise<SentMail[]> {
    await Promise.resolve(params)

    return [{ id: randomUUID(), recipients: this.getRecipients(params) }]
  }
}
