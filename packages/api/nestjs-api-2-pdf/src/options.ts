export interface Api2PdfStorageHeadersOptions {
  extraHTTPHeaders?: Record<string, string>
}

export interface Api2PdfStorageOptions extends Api2PdfStorageHeadersOptions {
  url: string
  method: 'PUT'
}

export interface Api2PdfHtmlToPdfOptions {
  html: string
  uploadUrl: string
  inline?: boolean
  fileName?: string
  storage?: Api2PdfStorageHeadersOptions
}

export interface Api2PdfHtmlToPdfRequestOptions extends Omit<Api2PdfHtmlToPdfOptions, 'uploadUrl'> {
  useCustomStorage: true
  storage: Api2PdfStorageOptions
}

export interface Api2PdfUrlToPdfOptions {
  url: string
  uploadUrl: string
  fileName?: string
  inline?: boolean
  storage?: Api2PdfStorageHeadersOptions
}

export interface Api2PdfUrlToPdfRequestOptions extends Omit<Api2PdfUrlToPdfOptions, 'uploadUrl'> {
  useCustomStorage: true
  storage: Api2PdfStorageOptions
}
