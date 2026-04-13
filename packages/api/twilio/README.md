# @wisemen/twilio

NestJS module for sending SMS messages and making phone calls using Twilio.

## Installation

```bash
pnpm add @wisemen/twilio
```

## Module Configuration

```typescript
import { Module } from '@nestjs/common'
import { TwilioModule } from '@wisemen/twilio'

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: 'your-account-sid',
      authToken: 'your-auth-token',
      phoneNumber: '+1234567890'
    })
  ],
  exports: [TwilioModule]
})
export class AppTwilioModule {}
```

```typescript
import { Module } from '@nestjs/common'
import { TwilioModule } from '@wisemen/twilio'

@Module({
  imports: [
    TwilioModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        accountSid: 'your-account-sid',
        authToken: 'your-auth-token',
        phoneNumber: '+1234567890'
      })
      inject: [ConfigService]
    })
  ],
  exports: [TwilioModule]
})
export class AppTwilioModule {}
```
## Usage

```typescript
import { Injectable } from '@nestjs/common'
import { Twilio } from '@wisemen/twilio'

@Injectable()
export class NotificationService {
  constructor(private readonly twilio: Twilio) {}

  async sendSMS(to: string, message: string) {
    return await this.twilio.createMessage(to, message)
  }

  async makeCall(to: string, message: string) {
    return await this.twilio.createCall(to, message)
  }
}
```

## License

GPL
