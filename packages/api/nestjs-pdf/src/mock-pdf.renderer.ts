import { Injectable } from '@nestjs/common'

import { AbstractPdfRenderer } from './abstract-pdf.renderer.js'
import type {
  MockPdfModuleOptions,
  PdfHtmlRenderOptions,
  PdfUrlRenderOptions,
} from './types.js'

const MOCK_PDF = Buffer.from('%PDF-1.4\n% Mock PDF\n')

@Injectable()
export class MockPdfRenderer extends AbstractPdfRenderer {
  private readonly pdf: Buffer

  constructor (options: MockPdfModuleOptions = { provider: 'mock' }) {
    super()
    this.pdf = options.pdf ?? MOCK_PDF
  }

  async renderFromHtml (_options: PdfHtmlRenderOptions): Promise<Buffer> {
    return await Promise.resolve(Buffer.from(this.pdf))
  }

  async renderFromUrl (_options: PdfUrlRenderOptions): Promise<Buffer> {
    return await Promise.resolve(Buffer.from(this.pdf))
  }
}
