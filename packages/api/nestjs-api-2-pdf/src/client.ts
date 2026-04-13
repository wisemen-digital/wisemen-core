import { Injectable } from '@nestjs/common'
import axios, { type AxiosInstance } from 'axios'
import { Api2PdfHtmlToPdfOptions, Api2PdfHtmlToPdfRequestOptions, Api2PdfUrlToPdfOptions, Api2PdfUrlToPdfRequestOptions } from './options.js'
import { Api2PdfModuleOptions } from '#src/module-options.js'

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
      useCustomStorage: true,
      storage: {
        method: 'PUT',
        url: options.uploadUrl,
        extraHTTPHeaders: options.storage?.extraHTTPHeaders
      }
    }

    await this.axios.post('/chrome/html', requestOptions)
  }

  async generatePdfFromUrl (options: Api2PdfUrlToPdfOptions): Promise<void> {
    const requestOptions: Api2PdfUrlToPdfRequestOptions = {
      url: options.url,
      inline: options.inline,
      fileName: options.fileName,
      useCustomStorage: true,
      storage: {
        method: 'PUT',
        url: options.uploadUrl,
        extraHTTPHeaders: options.storage?.extraHTTPHeaders
      }
    }

    await this.axios.post('/chrome/url', requestOptions)
  }
}
