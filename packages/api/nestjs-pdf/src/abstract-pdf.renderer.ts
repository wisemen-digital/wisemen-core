import axios from 'axios'

import { PdfUploadError } from './errors.js'

import type {
  PdfHtmlRenderOptions,
  PdfHtmlRenderToUploadOptions,
  PdfRenderer,
  PdfUploadOptions,
  PdfUrlRenderOptions,
  PdfUrlRenderToUploadOptions,
} from './types.js'

export abstract class AbstractPdfRenderer implements PdfRenderer {
  abstract renderFromHtml (options: PdfHtmlRenderOptions): Promise<Buffer>
  abstract renderFromUrl (options: PdfUrlRenderOptions): Promise<Buffer>

  async renderFromHtmlToUpload (options: PdfHtmlRenderToUploadOptions): Promise<void> {
    const pdf = await this.renderFromHtml(options)

    await this.upload(pdf, options.upload)
  }

  async renderFromUrlToUpload (options: PdfUrlRenderToUploadOptions): Promise<void> {
    const pdf = await this.renderFromUrl(options)

    await this.upload(pdf, options.upload)
  }

  protected async upload (pdf: Buffer, options: PdfUploadOptions): Promise<void> {
    try {
      await axios.request({
        data: pdf,
        headers: {
          'content-type': 'application/pdf',
          ...options.headers,
        },
        method: options.method ?? 'PUT',
        url: options.url,
      })
    } catch (error) {
      throw new PdfUploadError('Failed to upload rendered PDF', { cause: error })
    }
  }
}
