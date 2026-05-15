import { MockPdfRenderer } from './mock-pdf.renderer.js'
import { PlaywrightPdfRenderer } from './playwright-pdf.renderer.js'
import type {
  MockPdfModuleOptions,
  PdfModuleOptions,
  PdfRenderer,
  PlaywrightPdfModuleOptions,
} from './types.js'
import { exhaustiveCheck } from './exhaustive-check.js'

export function createPdfRenderer (options: MockPdfModuleOptions): MockPdfRenderer
export function createPdfRenderer (options: PlaywrightPdfModuleOptions): PlaywrightPdfRenderer
export function createPdfRenderer (options: PdfModuleOptions): PdfRenderer {
  const provider = options.provider

  switch (provider) {
    case 'mock': return new MockPdfRenderer(options)
    case 'playwright': return new PlaywrightPdfRenderer(options)
    default: return exhaustiveCheck(provider)
  }
}
