import { Api2PdfClient } from './client.js'
import { MockPdfClient } from './mock-pdf.client.js'
import { Api2PdfModuleOptions, MockPdfModuleOptions, PdfModuleOptions } from '#src/module-options.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'

export function factory (options: Api2PdfModuleOptions): Api2PdfClient
export function factory (options: MockPdfModuleOptions): MockPdfClient
export function factory (options: PdfModuleOptions): Api2PdfClient | MockPdfClient {
  const provider = options.provider

  switch (provider) {
    case 'mock': return new MockPdfClient()
    case 'api2pdf': return new Api2PdfClient(options)
    default: return exhaustiveCheck(provider)
  }
}
