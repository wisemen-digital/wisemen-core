import type { PdfNamedPageFormat } from '@/types/pdfPageFormat.type'

export type Html2PdfImageType = 'jpeg' | 'png' | 'webp'

export interface Html2PdfPagebreakOptions {
  after?: string | string[]
  avoid?: string | string[]
  before?: string | string[]
  mode?: string | string[]
}

export interface Html2PdfGenerateResult {
  blob: Blob
  objectUrl: string
}

export interface Html2PdfBeforeGeneratePayload {
  element: HTMLElement
  options: Record<string, unknown>
}

export interface Html2PdfGeneratorExpose {
  closePreview: () => void
  download: () => Promise<Blob>
  generate: () => Promise<Blob>
  preview: () => Promise<string>
  revokePreviewUrl: () => void
}

export type Html2PdfFormat = PdfNamedPageFormat
