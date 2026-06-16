---
name: getting-started
description: Use when configuring Twilio SMS or voice calls in NestJS apis.
---

# @wisemen/twilio - Getting Started

Register `TwilioModule` once with your account credentials, then inject
`Twilio` anywhere you need to send SMS messages or trigger phone calls.

## Register The Module

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TwilioModule } from '@wisemen/twilio'

@Module({
  imports: [TwilioModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      accountSid: config.getOrThrow('TWILIO_ACCOUNT_SID'),
      authToken: config.getOrThrow('TWILIO_AUTH_TOKEN'),
      phoneNumber: config.getOrThrow('TWILIO_PHONE_NUMBER'),
    })
  })],
  exports: [TwilioModule]
})
export class DefaultTwilioModule {}
```

Use `TwilioModule.forRoot(...)` instead when the credentials are already
available as static values.

## Send Messages And Calls

```ts
import { Injectable } from '@nestjs/common'
import { Twilio } from '@wisemen/twilio'

@Injectable()
export class NotificationService {
  constructor (
    private twilio: Twilio
  ) {}

  async sendVerificationCode(to: string, code: string) {
    return await this.twilio.createMessage(to, `Your verification code is ${code}.`)
  }

  async sendReminderCall(to: string, message: string) {
    return await this.twilio.createCall(to, message)
  }
}
```

Pass the already-formatted E.164 destination number as `to`; the package uses
the configured `phoneNumber` as the sender automatically.
