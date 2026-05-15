# @wisemen/nestjs-pdf

NestJS PDF rendering primitives for official server-side PDF generation.

## Why server-side rendering?

Use browser/client-side PDF generation for previews, drafts, and local exports. Use this package for official, legal, financial, emailed, archived, or highly pagination-sensitive PDFs where the runtime, fonts, assets, and pagination behavior should be controlled server-side.

## Installation

Install Playwright in applications that use the Playwright provider:

```sh
pnpm add playwright
```

## Module setup

```ts
import { PdfModule } from '@wisemen/nestjs-pdf'

PdfModule.forRootAsync({
  useFactory: () => ({
    provider: 'playwright',
    contextOptions: {
      extraHTTPHeaders: {
        'x-internal-renderer': 'pdf',
      },
    },
    pdfOptions: {
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
    },
  }),
})
```

## Rendering

Inject `PDF_RENDERER` and type it as `PdfRenderer`:

```ts
import {
  PDF_RENDERER,
  type PdfRenderer,
} from '@wisemen/nestjs-pdf'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class InvoicePdfService {
  constructor(
    @Inject(PDF_RENDERER)
    private readonly pdfRenderer: PdfRenderer,
  ) {}

  async render(html: string): Promise<Buffer> {
    return await this.pdfRenderer.renderFromHtml({
      html,
      pdfOptions: {
        format: 'A4',
      },
    })
  }
}
```

## Rendering from URLs

```ts
const pdf = await pdfRenderer.renderFromUrl({
  url: 'https://app.example.com/pdf/invoices/123',
  contextOptions: {
    extraHTTPHeaders: {
      authorization: `Bearer ${token}`,
    },
  },
  waitUntil: 'networkidle',
})
```

## Rendering authenticated routes

Pass authentication and tenant context through per-render `contextOptions`. Per-render headers are merged with module-level headers:

```ts
await pdfRenderer.renderFromUrl({
  url,
  contextOptions: {
    extraHTTPHeaders: {
      authorization: `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  },
})
```

For HTML rendering through `renderFromHtml`, use absolute asset URLs, inline assets, or include a `<base href="https://app.example.com/">` tag so Chromium can resolve stylesheets, fonts, and images.

## Recommended official PDF HTML

Prefer print-aware HTML and CSS. Use `@page`, print color adjustment, absolute assets, and the shared pagebreak classes from `@wisemen/vue-core-pdf`:

```html
<!doctype html>
<html>
  <head>
    <base href="https://app.example.com/">
    <style>
      @page {
        size: A4;
        margin: 20mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #111827;
        background: white;
        font-family: Inter, Arial, sans-serif;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .pdf-page-break-before {
        break-before: page;
        page-break-before: always;
      }

      .pdf-page-break-after {
        break-after: page;
        page-break-after: always;
      }

      .pdf-page-break-avoid,
      .pdf-keep-together {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="pdf-keep-together">
        Invoice header
      </section>

      <section class="pdf-page-break-before">
        Terms and conditions
      </section>
    </main>
  </body>
</html>
```

For Vue-rendered templates, include `@wisemen/vue-core-pdf/style.css` in the rendered page so the shared pagebreak classes are available to Chromium.

## Browser lifecycle

The Playwright provider lazily launches one Chromium browser per renderer instance and reuses it across renders. Each render gets an isolated browser context and page. The browser is closed when the Nest module is destroyed.

## Integration smoke test

Regular tests mock Playwright for speed and stability. To run the optional real Chromium smoke test locally or in a prepared CI environment, install Playwright browsers and run:

```sh
pnpm --filter @wisemen/nestjs-pdf test:integration
```

## Upload helpers

The core API is buffer-first. Upload helpers are available for storage flows:

```ts
await pdfRenderer.renderFromHtmlToUpload({
  html,
  upload: {
    url: signedUploadUrl,
    headers: {
      'x-custom-header': 'value',
    },
  },
})
```

## Pagebreak conventions

When templates also use `@wisemen/vue-core-pdf`, include its stylesheet and use the shared pagebreak classes:

- `.pdf-page-break-before`
- `.pdf-page-break-after`
- `.pdf-page-break-avoid`
- `.pdf-keep-together`

These classes express layout intent in a renderer-agnostic way and work with browser preview, client-side `html2pdf`, browser print, and Playwright server-side rendering.

## Errors

Rendering failures are wrapped in `PdfRenderError`. Upload failures are wrapped in `PdfUploadError`. The original error is available as `cause`.
