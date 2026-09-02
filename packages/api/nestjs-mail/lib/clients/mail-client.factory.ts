import { MailProvider } from '../enums/mail-provider.enum.js'
import type { MailModuleOptions } from '../modules/mail.module-options.js'
import { exhaustiveCheck } from '../utils/exhaustive-check.js'
import type { MailClient } from './mail.client.js'
import { MailPitMailClient } from './mailpit-mail.client.js'
import { MockMailClient } from './mock-mail.client.js'
import { ScalewayMailClient } from './scaleway-mail.client.js'
import { SendGridMailClient } from './sendgrid-mail.client.js'

export function createMailClient (options: MailModuleOptions['client']): MailClient {
  switch (options.type) {
    case 'mailpit':
      return new MailPitMailClient(options)
    case 'mock':
      return new MockMailClient()
    case MailProvider.SCALEWAY:
      return new ScalewayMailClient(options)
    case MailProvider.SEND_GRID:
      return new SendGridMailClient(options)
    default:
      exhaustiveCheck(options)
  }
}

export const mailClientFactory = createMailClient
