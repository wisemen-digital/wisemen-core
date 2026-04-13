import { PdfGenerationStatus } from './enums/pdf-generation-status.enum.js'

interface PdfCallbackBaseOptions<T = unknown> {
  url: string
  data?: T
}

interface GeneratePdfFailedCallbackOptions<T = unknown> extends PdfCallbackBaseOptions<T> {
  status: PdfGenerationStatus.FAILED
  error: string
}

interface GeneratePdfCompletedCallbackOptions<T = unknown> extends PdfCallbackBaseOptions<T> {
  status: PdfGenerationStatus.COMPLETED
  s3Path: string
}

export type GeneratePdfCallbackOptions<T = unknown> = GeneratePdfFailedCallbackOptions<T>
  | GeneratePdfCompletedCallbackOptions<T>
