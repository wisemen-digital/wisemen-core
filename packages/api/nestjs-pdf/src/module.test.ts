import assert from 'node:assert/strict'
import { describe, it, mock } from 'node:test'

import { PdfModule } from './module.js'
import type { PdfRenderer } from './types.js'

void describe('PdfModule', () => {
  void it('closes the renderer on module destroy', async () => {
    const close = mock.fn(async () => undefined)
    const renderer = {
      close,
      renderFromHtml: async () => await Promise.resolve(Buffer.from('')),
      renderFromHtmlToUpload: async () => await Promise.resolve(),
      renderFromUrl: async () => await Promise.resolve(Buffer.from('')),
      renderFromUrlToUpload: async () => await Promise.resolve(),
    } satisfies PdfRenderer & { close: () => Promise<void> }
    const module = new PdfModule(renderer)

    await module.onModuleDestroy()

    assert.equal(close.mock.callCount(), 1)
  })

  void it('allows module destroy without a closeable renderer', async () => {
    const module = new PdfModule(undefined)

    await assert.doesNotReject(async () => await module.onModuleDestroy())
  })
})
