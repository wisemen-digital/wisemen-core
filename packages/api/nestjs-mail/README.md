# `@wisemen/nestjs-mail`

Reusable NestJS mail infrastructure for Wisemen services.

## What it provides

- `MailModule.forRoot()` and `MailModule.forRootAsync()` for DI-friendly mail client wiring
- `HandlebarsRenderer` integration through `@wisemen/nestjs-handlebars`
- Mail providers for MailPit, Scaleway, and SendGrid
- Shared mail errors, enums, and message types

## Usage

```ts
import { Module } from '@nestjs/common'
import { MailModule } from '@wisemen/nestjs-mail'

@Module({
  imports: [
    MailModule.forRoot({
      templateRootPath: process.cwd() + '/dist/src/modules',
      client: {
        type: 'mailpit',
        url: 'http://127.0.0.1:8025'
      }
    })
  ]
})
export class AppModule {}
```

Project-specific policy belongs outside the package. In larger apps, use `forRootAsync()` and resolve the `client` options from environment variables, feature flags, secrets, or test doubles in your own factory.

Install `@wisemen/nestjs-handlebars` alongside this package when you want to inject `HandlebarsRenderer` for template-based mail rendering.
