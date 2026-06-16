import { Injectable } from '@nestjs/common'
import axios, { type AxiosInstance } from 'axios'
import { Api2PdfModuleOptions } from '#src/module-options.js'
import { Api2PdfHtmlToPdfOptions, Api2PdfHtmlToPdfRequestOptions, Api2PdfUrlToPdfOptions, Api2PdfUrlToPdfRequestOptions, Api2PdfStorageOptions } from '#src/options.js'



@Injectable()
export class Api2PdfClient {
  private readonly axios: AxiosInstance

  constructor (options: Api2PdfModuleOptions) {
    this.axios = axios.create({
      baseURL: options.baseUrl,
      headers: { Authorization: options.apiKey }
    })
  }

  async generatePdfFromHtml (options: Api2PdfHtmlToPdfOptions): Promise<void> {
    const requestOptions: Api2PdfHtmlToPdfRequestOptions = {
      html: options.html,
      inline: options.inline,
      fileName: options.fileName,
      options: options.options,
      useCustomStorage: true,
      storage: this.createStorageOptions(options.uploadUrl, options.storage?.extraHTTPHeaders)
    }

    await this.axios.post('/chrome/pdf/html' , requestOptions)
  }

  async generatePdfFromUrl (options: Api2PdfUrlToPdfOptions): Promise<void> {
    const requestOptions: Api2PdfUrlToPdfRequestOptions = {
      url: options.url,
      inline: options.inline,
      fileName: options.fileName,
      extraHTTPHeaders: options.extraHTTPHeaders,
      options: {
        puppeteerWaitForMethod: 'WaitForNavigation',
        puppeteerWaitForValue: 'networkidle0',
        ...options.options
      },
      useCustomStorage: true,
      storage: this.createStorageOptions(options.uploadUrl, options.storage?.extraHTTPHeaders)
    }

    await this.axios.post('/chrome/pdf/url', requestOptions)
  }

  private createStorageOptions (
    uploadUrl: string,
    extraHTTPHeaders?: Record<string, string>
  ): Api2PdfStorageOptions {
    return {
      method: 'PUT',
      url: uploadUrl,
      extraHTTPHeaders
    }
  }
}
