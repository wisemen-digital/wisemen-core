# @wisemen/nestjs-api-2-pdf

NestJS module for generating PDFs through API2PDF, with a built-in mock provider for tests and local development.

## Features

- NestJS dynamic module (`Api2PdfModule.forRootAsync`)
- Real API2PDF client (`provider: 'api2pdf'`)
- Mock client (`provider: 'mock'`)
- PDF generation from HTML or URL
- Upload generated PDFs to your own storage URL (`useCustomStorage: true`)

## Installation

```bash
pnpm add @wisemen/nestjs-api-2-pdf
```

Peer dependencies:

- `@nestjs/common`

## Module Setup

### API2PDF provider

```ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Api2PdfModule } from '@wisemen/nestjs-api-2-pdf'

@Module({
	imports: [
		ConfigModule,
		Api2PdfModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				provider: 'api2pdf',
				apiKey: config.getOrThrow('API2PDF_API_KEY'),
				baseUrl: config.getOrThrow('API2PDF_BASE_URL')
			})
		})
	],
    exports: [Api2PdfModule]
})
export class DefaultApi2PdfModule {}
```

### Mock provider (tests/local)

```ts
import { Module } from '@nestjs/common'
import { Api2PdfModule } from '@wisemen/nestjs-api-2-pdf'

@Module({
	imports: [
		Api2PdfModule.forRootAsync({
			useFactory: () => ({
				provider: 'mock'
			})
		})
	]
})
export class AppModule {}
```

## Usage

Inject `Api2PdfClient` and call one of its methods.

```ts
import { Injectable } from '@nestjs/common'
import { Api2PdfClient } from '@wisemen/nestjs-api-2-pdf'

@Injectable()
export class InvoicePdfService {
	constructor(
        private pdfClient: Api2PdfClient
    ) {}

	async generateFromHtml(uploadUrl: string, html: string): Promise<void> {
		await this.pdfClient.generatePdfFromHtml({
			html,
			uploadUrl,
			fileName: 'invoice.pdf',
			inline: false
		})
	}

	async generateFromUrl(uploadUrl: string, url: string): Promise<void> {
		await this.pdfClient.generatePdfFromUrl({
			url,
			uploadUrl,
			fileName: 'invoice.pdf',
			inline: false
		})
	}
}
```

## API

### `Api2PdfClient`

- `generatePdfFromHtml(options: Api2PdfHtmlToPdfOptions): Promise<void>`
- `generatePdfFromUrl(options: Api2PdfUrlToPdfOptions): Promise<void>`

### `Api2PdfHtmlToPdfOptions`

- `html: string`
- `uploadUrl: string`
- `inline?: boolean`
- `fileName?: string`
- `storage?: { extraHTTPHeaders?: Record<string, string> }`

### `Api2PdfUrlToPdfOptions`

- `url: string`
- `uploadUrl: string`
- `inline?: boolean`
- `fileName?: string`
- `storage?: { extraHTTPHeaders?: Record<string, string> }`

## Notes

- The module always uses custom storage upload mode (`useCustomStorage: true`) and performs a `PUT` to `uploadUrl`.
- For the API2PDF provider, the client sends `Authorization: <apiKey>` to `baseUrl`.
- The mock provider resolves successfully without external calls.

## Development

Build:

```bash
pnpm build
```

Lint:

```bash
pnpm lint
```
