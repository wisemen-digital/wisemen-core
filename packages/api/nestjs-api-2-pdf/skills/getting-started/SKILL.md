---
name: getting-started
description: Generate PDFs through API2PDF in NestJS. Use when converting HTML or URLs to PDFs in apis.
---

### Register the module with a `useFactory` that switches on `NODE_ENV`

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Api2PdfModule } from '@wisemen/nestjs-api-2-pdf'

@Module({
  imports: [
    Api2PdfModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.getOrThrow('NODE_ENV') === 'test') {
          return {
            provider: 'mock'
          }
        }

        return {
          provider: 'api2pdf',
          apiKey: config.getOrThrow('API2PDF_API_KEY'),
          baseUrl: config.getOrThrow('API2PDF_BASE_URL')
        }
      }
    })
  ],
  exports: [Api2PdfModule]
})
export class DefaultApi2PdfModule {}
```

### Generate a PDF from HTML

```ts
import { Injectable } from '@nestjs/common'
import { Api2PdfClient } from '@wisemen/nestjs-api-2-pdf'

@Injectable()
export class InvoicePdfService {
  constructor(private readonly pdfClient: Api2PdfClient) {}

  async generate(uploadUrl: string, html: string): Promise<void> {
    await this.pdfClient.generatePdfFromHtml({
      html,
      uploadUrl,
      fileName: 'invoice.pdf',
      inline: false
    })
  }
}
```

### Generate a PDF from a URL

```ts
await this.pdfClient.generatePdfFromUrl({
  url: 'https://example.com/invoice/123',
  uploadUrl,
  fileName: 'invoice.pdf',
  inline: false,
  extraHTTPHeaders: {
    'Accept-Language': locale
  }
})
```

### Best practices

- The html content and filename should be locale-aware values. Use your preferred i18n helpers.
- PDF generation is preferably done asynchronously in a job.

### Layout and upload options

`generatePdfFromHtml()` and `generatePdfFromUrl()` support:

- `fileName`
- `uploadUrl` url location where the resulting pdf will be uploaded (with a PUT method)
- `inline`: true to open in the browser, false to trigger download behavior.
- `options` for layout settings like `landscape`, `printBackground`, `marginTop`, `marginLeft`, `marginRight`
- `storage.extraHTTPHeaders` for headers sent with the upload request

### Notes

- Inject `Api2PdfClient` regardless of whether the configured provider is `api2pdf` or `mock`.
- The package always uploads the generated file to `uploadUrl` with a `PUT` request.
