import { Injectable } from '@nestjs/common'
import {
  chromium,
  type Browser,
  type BrowserContextOptions,
  type Page,
} from 'playwright'

import { AbstractPdfRenderer } from './abstract-pdf.renderer.js'
import { PdfRenderError } from './errors.js'
import type {
  PdfHtmlRenderOptions,
  PdfUrlRenderOptions,
  PlaywrightPdfModuleOptions,
} from './types.js'

@Injectable()
export class PlaywrightPdfRenderer extends AbstractPdfRenderer {
  private browser: Browser | null = null

  constructor (private readonly options: PlaywrightPdfModuleOptions) {
    super()
  }

  async close (): Promise<void> {
    if (this.browser === null) {
      return
    }

    const browser = this.browser

    this.browser = null
    await browser.close()
  }

  async renderFromHtml (options: PdfHtmlRenderOptions): Promise<Buffer> {
    try {
      return await this.withPage(options.contextOptions, async (page) => {
        await page.setContent(options.html, {
          ...options.setContentOptions,
          waitUntil: options.waitUntil ?? this.options.waitUntil ?? 'networkidle',
        })

        return await page.pdf(this.createPdfOptions(options))
      })
    } catch (error) {
      throw new PdfRenderError('Failed to render PDF from HTML', { cause: error })
    }
  }

  async renderFromUrl (options: PdfUrlRenderOptions): Promise<Buffer> {
    try {
      return await this.withPage(options.contextOptions, async (page) => {
        await page.goto(options.url, {
          ...options.gotoOptions,
          waitUntil: options.waitUntil ?? this.options.waitUntil ?? 'networkidle',
        })

        return await page.pdf(this.createPdfOptions(options))
      })
    } catch (error) {
      throw new PdfRenderError('Failed to render PDF from URL', { cause: error })
    }
  }

  private async getBrowser (): Promise<Browser> {
    if (this.browser === null || !this.browser.isConnected()) {
      this.browser = await chromium.launch(this.options.launchOptions)
    }

    return this.browser
  }

  private createContextOptions (options?: BrowserContextOptions): BrowserContextOptions | undefined {
    if (this.options.contextOptions === undefined) {
      return options
    }

    return {
      ...this.options.contextOptions,
      ...options,
      extraHTTPHeaders: {
        ...this.options.contextOptions.extraHTTPHeaders,
        ...options?.extraHTTPHeaders,
      },
    }
  }

  private createPdfOptions (options: PdfHtmlRenderOptions | PdfUrlRenderOptions) {
    return {
      printBackground: true,
      preferCSSPageSize: true,
      ...this.options.pdfOptions,
      ...options.pdfOptions,
    }
  }

  private async withPage (contextOptions: BrowserContextOptions | undefined, callback: (page: Page) => Promise<Buffer>): Promise<Buffer> {
    const browser = await this.getBrowser()
    const context = await browser.newContext(this.createContextOptions(contextOptions))

    try {
      const page = await context.newPage()

      await page.emulateMedia({ media: 'print' })

      return await callback(page)
    } finally {
      await context.close()
    }
  }
}
