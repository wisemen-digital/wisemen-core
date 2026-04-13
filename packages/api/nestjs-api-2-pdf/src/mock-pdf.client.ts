import { Injectable } from '@nestjs/common'
import { Api2PdfClient } from './client.js'
import { Api2PdfHtmlToPdfOptions, Api2PdfUrlToPdfOptions } from './options.js'

type Api2PdfClientContract = Pick<Api2PdfClient, 'generatePdfFromHtml' | 'generatePdfFromUrl'>

@Injectable()
export class MockPdfClient implements Api2PdfClientContract {
  async generatePdfFromHtml (_options: Api2PdfHtmlToPdfOptions): Promise<void> {
    await Promise.resolve()
  }

  async generatePdfFromUrl (_options: Api2PdfUrlToPdfOptions): Promise<void> {
    await Promise.resolve()
  }
}
