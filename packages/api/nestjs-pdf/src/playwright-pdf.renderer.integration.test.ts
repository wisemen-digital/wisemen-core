import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { PlaywrightPdfRenderer } from './playwright-pdf.renderer.js'

const SHOULD_RUN_INTEGRATION = process.env.RUN_PLAYWRIGHT_PDF_INTEGRATION === 'true'

void describe('PlaywrightPdfRenderer integration', {
  skip: !SHOULD_RUN_INTEGRATION,
}, () => {
  void it('renders real HTML to a PDF buffer', async () => {
    const renderer = new PlaywrightPdfRenderer({ provider: 'playwright' })

    try {
      const pdf = await renderer.renderFromHtml({
        html: `
          <!doctype html>
          <html>
            <head>
              <style>
                @page { size: A4; margin: 20mm; }
                body { font-family: Arial, sans-serif; }
                .pdf-page-break-before { break-before: page; page-break-before: always; }
                .pdf-keep-together { break-inside: avoid; page-break-inside: avoid; }
              </style>
            </head>
            <body>
              <main>
                <h1>Hello PDF</h1>
                <section class="pdf-keep-together">
                  <p>This section should avoid splitting across pages.</p>
                </section>
                <section class="pdf-page-break-before">
                  <h2>Second page</h2>
                </section>
              </main>
            </body>
          </html>
        `,
      })

      assert.equal(pdf.subarray(0, 4).toString(), '%PDF')
    } finally {
      await renderer.close()
    }
  })
})
