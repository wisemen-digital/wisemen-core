import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { createPdfRenderer } from './factory.js'
import { MockPdfRenderer } from './mock-pdf.renderer.js'
import { PlaywrightPdfRenderer } from './playwright-pdf.renderer.js'

void describe('createPdfRenderer', () => {
  void it('creates a mock renderer', () => {
    const renderer = createPdfRenderer({ provider: 'mock' })

    assert.equal(renderer instanceof MockPdfRenderer, true)
  })

  void it('creates a Playwright renderer', () => {
    const renderer = createPdfRenderer({ provider: 'playwright' })

    assert.equal(renderer instanceof PlaywrightPdfRenderer, true)
  })
})
