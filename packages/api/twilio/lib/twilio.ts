import { Injectable } from '@nestjs/common'
import twilio, { Twilio as TwilioClient } from 'twilio'
import { CallInstance, CallListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/call.js'
import { MessageInstance, MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message.js'
import { TwilioOptions } from './twilio-options.js'

type MessageCallback = Parameters<TwilioClient['messages']['create']>[1]
type CallCallback = Parameters<TwilioClient['calls']['create']>[1]

@Injectable()
export class Twilio {
  private _client?: TwilioClient

  constructor (
    private options: TwilioOptions
  ) {}

  async createMessage (to: string, body: string, cb?: MessageCallback): Promise<MessageInstance> {
    const params: MessageListInstanceCreateOptions = { from: this.options.phoneNumber, to, body }

    return await this.client.messages.create(params, cb)
  }

  async createCall (to: string, body: string, cb?: CallCallback): Promise<CallInstance> {
    const params: CallListInstanceCreateOptions = {
      from: this.options.phoneNumber,
      to,
      twiml: `<Response><Say>${body}</Say></Response>`
    }

    return await this.client.calls.create(params, cb)
  }

  private get client (): TwilioClient {
    if (this._client == null) {
      this._client = twilio(this.options.accountSid, this.options.authToken)
    }

    return this._client
  }
}
