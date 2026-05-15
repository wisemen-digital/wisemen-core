import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MockPdfRenderer } from './mock-pdf.renderer.js'

void describe('MockPdfRenderer', () => {
  void it('returns the configured PDF for HTML rendering', async () => {
    const pdf = Buffer.from('mock-pdf')
    const renderer = new MockPdfRenderer({
      provider: 'mock',
      pdf,
    })

    const result = await renderer.renderFromHtml({ html: '<main />' })

    assert.deepEqual(result, pdf)
    assert.notEqual(result, pdf)
  })

  void it('returns the configured PDF for URL rendering', async () => {
    const pdf = Buffer.from('mock-url-pdf')
    const renderer = new MockPdfRenderer({
      provider: 'mock',
      pdf,
    })

    const result = await renderer.renderFromUrl({ url: 'https://example.com/pdf' })

    assert.deepEqual(result, pdf)
    assert.notEqual(result, pdf)
  })
})
