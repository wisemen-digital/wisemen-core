import type { PdfNamedPageFormat } from '@/types/pdfPageFormat.type'

export type Html2PdfImageType = 'jpeg' | 'png' | 'webp'

export type Html2PdfMargin = number | [number, number] | [number, number, number, number]

export interface Html2PdfPagebreakOptions {
  after?: string | string[]
  avoid?: string | string[]
  before?: string | string[]
  mode?: string | string[]
}

export interface Html2PdfCanvasOptions {
  allowTaint?: boolean
  backgroundColor?: string | null
  foreignObjectRendering?: boolean
  imageTimeout?: number
  letterRendering?: boolean
  logging?: boolean
  scale?: number
  useCORS?: boolean
  windowHeight?: number
  windowWidth?: number
  x?: number
  y?: number
}

export interface Html2PdfJsPdfOptions {
  compress?: boolean
  format?: string | [number, number]
  hotfixes?: string[]
  orientation?: 'landscape' | 'portrait'
  precision?: number
  unit?: 'cm' | 'in' | 'mm' | 'px' | 'pt'
}

export interface Html2PdfImageOptions {
  quality?: number
  type?: Html2PdfImageType
}

export interface Html2PdfOptions {
  enableLinks?: boolean
  filename?: string
  hotfix?: string[]
  html2canvas?: Html2PdfCanvasOptions
  image?: Html2PdfImageOptions
  jsPDF?: Html2PdfJsPdfOptions
  margin?: Html2PdfMargin
  pagebreak?: Html2PdfPagebreakOptions
}

export interface Html2PdfGenerateResult {
  blob: Blob
  objectUrl: string
}

export interface Html2PdfGenerationState {
  blob: Blob | null
  isGenerating: boolean
  previewUrl: string | null
  progress: number
}

export interface Html2PdfBeforeGeneratePayload {
  element: HTMLElement
  options: Record<string, unknown>
}

export interface Html2PdfGeneratorExpose {
  closePreview: () => void
  download: () => Promise<Blob>
  generate: () => Promise<Blob>
  generatedBlob: Blob | null
  generationState: Html2PdfGenerationState
  isGenerating: boolean
  preview: () => Promise<string>
  previewUrl: string | null
  progress: number
  revokePreviewUrl: () => void
}

export type Html2PdfFormat = PdfNamedPageFormat
