type HttpHeaders = Record<string, string>

export interface Api2PdfStorageHeadersOptions {
  extraHTTPHeaders?: HttpHeaders
}

export interface Api2PdfStorageOptions extends Api2PdfStorageHeadersOptions {
  url: string
  method: 'PUT'
}

export interface Api2PdfLayoutOptions {
  delay?: number
  scale?: number
  displayHeaderFooter?: boolean
  headerTemplate?: string
  footerTemplate?: string
  printBackground?: boolean
  landscape?: boolean
  pageRanges?: string
  width?: string
  height?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  preferCSSPageSize?: boolean
  omitBackground?: boolean
  tagged?: boolean
  outline?: boolean
  usePrintCss?: boolean
  puppeteerWaitForMethod?: string
  puppeteerWaitForValue?: string
}

interface Api2PdfBasePdfOptions {
  inline?: boolean
  fileName?: string
  options?: Api2PdfLayoutOptions
}

export interface Api2PdfHtmlToPdfOptions extends Api2PdfBasePdfOptions {
  html: string
  uploadUrl: string
  storage?: Api2PdfStorageHeadersOptions
}

export interface Api2PdfHtmlToPdfRequestOptions extends Omit<Api2PdfHtmlToPdfOptions, 'uploadUrl' | 'storage'> {
  useCustomStorage: true
  storage: Api2PdfStorageOptions
}

export interface Api2PdfUrlToPdfOptions extends Api2PdfBasePdfOptions {
  url: string
  uploadUrl: string
  /**
   * Validate if the passed url is reachable. If not, the api2pdf will not be called and generatePdfFromUrl will throw.
   * @default false
   * */
  ensureReachable?: boolean
  storage?: Api2PdfStorageHeadersOptions
  extraHTTPHeaders?: HttpHeaders
}

export interface Api2PdfUrlToPdfRequestOptions extends Omit<Api2PdfUrlToPdfOptions, 'uploadUrl' | 'storage'> {
  useCustomStorage: true
  storage: Api2PdfStorageOptions
}
