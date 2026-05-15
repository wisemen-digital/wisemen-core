import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'

import axios from 'axios'

import { AbstractPdfRenderer } from './abstract-pdf.renderer.js'
import { PdfUploadError } from './errors.js'
import type {
  PdfHtmlRenderOptions,
  PdfUrlRenderOptions,
} from './types.js'

class TestPdfRenderer extends AbstractPdfRenderer {
  async renderFromHtml (_options: PdfHtmlRenderOptions): Promise<Buffer> {
    return await Promise.resolve(Buffer.from('html-pdf'))
  }

  async renderFromUrl (_options: PdfUrlRenderOptions): Promise<Buffer> {
    return await Promise.resolve(Buffer.from('url-pdf'))
  }
}

void describe('AbstractPdfRenderer', () => {
  afterEach(() => {
    mock.restoreAll()
  })

  void it('uploads rendered HTML PDFs', async () => {
    const requestMock = mock.method(axios, 'request', async () => ({ status: 200 }))
    const renderer = new TestPdfRenderer()

    await renderer.renderFromHtmlToUpload({
      html: '<main />',
      upload: {
        headers: {
          'x-upload': 'true',
        },
        url: 'https://example.com/upload',
      },
    })

    assert.deepEqual(requestMock.mock.calls[0]?.arguments, [{
      data: Buffer.from('html-pdf'),
      headers: {
        'content-type': 'application/pdf',
        'x-upload': 'true',
      },
      method: 'PUT',
      url: 'https://example.com/upload',
    }])
  })

  void it('wraps upload errors', async () => {
    mock.method(axios, 'request', async () => {
      throw new Error('upload failed')
    })
    const renderer = new TestPdfRenderer()

    await assert.rejects(
      async () => await renderer.renderFromUrlToUpload({
        upload: {
          url: 'https://example.com/upload',
        },
        url: 'https://example.com/pdf',
      }),
      PdfUploadError,
    )
  })
})
