import type {
  BrowserContextOptions,
  LaunchOptions,
  Page,
} from 'playwright'

export type PdfProvider = 'mock' | 'playwright'

export type PdfOptions = NonNullable<Parameters<Page['pdf']>[0]>
export type PdfWaitUntil = NonNullable<NonNullable<Parameters<Page['goto']>[1]>['waitUntil']>

export interface PdfRenderOptions {
  contextOptions?: BrowserContextOptions
  pdfOptions?: PdfOptions
  waitUntil?: PdfWaitUntil
}

export interface PdfHtmlRenderOptions extends PdfRenderOptions {
  setContentOptions?: Omit<NonNullable<Parameters<Page['setContent']>[1]>, 'waitUntil'>
  html: string
}

export interface PdfUrlRenderOptions extends PdfRenderOptions {
  gotoOptions?: Omit<NonNullable<Parameters<Page['goto']>[1]>, 'waitUntil'>
  url: string
}

export interface PdfUploadOptions {
  headers?: Record<string, string>
  method?: 'PUT'
  url: string
}

export interface PdfHtmlRenderToUploadOptions extends PdfHtmlRenderOptions {
  upload: PdfUploadOptions
}

export interface PdfUrlRenderToUploadOptions extends PdfUrlRenderOptions {
  upload: PdfUploadOptions
}

export interface PdfRenderer {
  renderFromHtml: (options: PdfHtmlRenderOptions) => Promise<Buffer>
  renderFromUrl: (options: PdfUrlRenderOptions) => Promise<Buffer>
  renderFromHtmlToUpload: (options: PdfHtmlRenderToUploadOptions) => Promise<void>
  renderFromUrlToUpload: (options: PdfUrlRenderToUploadOptions) => Promise<void>
}

export interface MockPdfModuleOptions {
  provider: 'mock'
  pdf?: Buffer
}

export interface PlaywrightPdfModuleOptions {
  provider: 'playwright'
  contextOptions?: BrowserContextOptions
  launchOptions?: LaunchOptions
  pdfOptions?: PdfOptions
  waitUntil?: PdfWaitUntil
}

export type PdfModuleOptions = MockPdfModuleOptions | PlaywrightPdfModuleOptions
