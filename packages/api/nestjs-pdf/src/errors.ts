export class PdfRenderError extends Error {
  constructor (message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PdfRenderError'
  }
}

export class PdfUploadError extends Error {
  constructor (message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PdfUploadError'
  }
}
