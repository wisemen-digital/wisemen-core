import type { ModuleMetadata } from '@nestjs/common'

export const PDF_MODULE_OPTIONS = Symbol('PDF_MODULE_OPTIONS')

export type PdfProvider = 'api2pdf' | 'mock'

export type MockPdfModuleOptions = { provider: 'mock' }
export type Api2PdfModuleOptions = {
  provider: 'api2pdf'
  apiKey: string
  baseUrl: string
}

export type PdfModuleOptions = MockPdfModuleOptions | Api2PdfModuleOptions

export interface PdfModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  inject?: Array<string | symbol | Function>
  useFactory: (...args: unknown[]) => Promise<PdfModuleOptions> | PdfModuleOptions
}
