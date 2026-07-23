---
name: getting-started
description: Use when configuring transactional mail delivery in NestJS APIs with @wisemen/nestjs-mail.
---

# @wisemen/nestjs-mail - Getting Started

Use `MailModule.forRootAsync(...)` to register a shared `MailClient` and
`HandlebarsRenderer`, then keep provider selection in your application layer.

## Send Mail

Inject `MailClient` into a use case, service, or job handler and call
`sendMail(...)` with html or text content.

```ts
import { Injectable } from '@nestjs/common'
import { MailClient } from '@wisemen/nestjs-mail'

@Injectable()
export class SendWelcomeMailUseCase {
  constructor(private readonly mailClient: MailClient) {}

  async send(to: string): Promise<void> {
    await this.mailClient.sendMail({
      to,
      subject: 'Welcome',
      text: 'Welcome to the platform'
    })
  }
}
```

## Render Handlebars Templates

Use `HandlebarsRenderer` when the mail body should come from `.hbs` templates in
your built application output.

```ts
import { Injectable } from '@nestjs/common'
import { HandlebarsRenderer } from '@wisemen/nestjs-handlebars'
import { MailClient } from '@wisemen/nestjs-mail'

@Injectable()
export class SendTemplateMailUseCase {
  constructor(
    private readonly mailClient: MailClient,
    private readonly renderer: HandlebarsRenderer
  ) {}

  async send(to: string, data: Record<string, unknown>): Promise<void> {
    const [html, text] = await Promise.all([
      this.renderer.render('mail/templates/welcome.html.hbs', data),
      this.renderer.render('mail/templates/welcome.text.hbs', data)
    ])

    await this.mailClient.sendMail({
      to,
      subject: 'Welcome',
      html,
      text
    })
  }
}
```
