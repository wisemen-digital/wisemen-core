import { Injectable } from '@nestjs/common'
import { MailClient, type SendMailOptions } from './mail.client.js'

@Injectable()
export class MockMailClient extends MailClient {
  async sendMail (params: SendMailOptions): Promise<void> {
    await Promise.resolve(params)
  }
}
