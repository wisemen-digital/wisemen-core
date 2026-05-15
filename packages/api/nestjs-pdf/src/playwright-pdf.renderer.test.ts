import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'

import { PlaywrightPdfRenderer } from './playwright-pdf.renderer.js'
import { PdfRenderError } from './errors.js'
import { chromium } from 'playwright'

void describe('PlaywrightPdfRenderer', () => {
  afterEach(() => {
    mock.restoreAll()
  })

  void it('renders HTML with Playwright print defaults and option overrides', async () => {
    const pdf = Buffer.from('pdf')
    const page = createPageMock(pdf)
    const context = createContextMock(page)
    const browser = createBrowserMock(context)
    const launchMock = mock.method(chromium, 'launch', async () => browser)
    const renderer = new PlaywrightPdfRenderer({
      provider: 'playwright',
      pdfOptions: {
        format: 'A4',
      },
    })

    const result = await renderer.renderFromHtml({
      html: '<main>Invoice</main>',
      pdfOptions: {
        landscape: true,
      },
    })

    assert.equal(result, pdf)
    assert.equal(launchMock.mock.callCount(), 1)
    assert.deepEqual(page.setContent.mock.calls[0]?.arguments, [
      '<main>Invoice</main>',
      { waitUntil: 'networkidle' },
    ])
    assert.deepEqual(page.pdf.mock.calls[0]?.arguments, [{
      format: 'A4',
      landscape: true,
      preferCSSPageSize: true,
      printBackground: true,
    }])
    assert.equal(context.close.mock.callCount(), 1)

    await renderer.close()

    assert.equal(browser.close.mock.callCount(), 1)
  })

  void it('renders a URL with configured waitUntil defaults', async () => {
    const pdf = Buffer.from('url-pdf')
    const page = createPageMock(pdf)
    const context = createContextMock(page)
    const browser = createBrowserMock(context)
    mock.method(chromium, 'launch', async () => browser)
    const renderer = new PlaywrightPdfRenderer({
      provider: 'playwright',
      waitUntil: 'load',
    })

    const result = await renderer.renderFromUrl({
      url: 'https://example.com/pdf',
      waitUntil: 'domcontentloaded',
    })

    assert.equal(result, pdf)
    assert.deepEqual(page.goto.mock.calls[0]?.arguments, [
      'https://example.com/pdf',
      { waitUntil: 'domcontentloaded' },
    ])
  })

  void it('reuses the browser and merges per-render context headers', async () => {
    const pdf = Buffer.from('pdf')
    const firstPage = createPageMock(pdf)
    const secondPage = createPageMock(pdf)
    const firstContext = createContextMock(firstPage)
    const secondContext = createContextMock(secondPage)
    const browser = createBrowserMock(firstContext)

    browser.newContext.mock.mockImplementationOnce(async () => firstContext)
    browser.newContext.mock.mockImplementationOnce(async () => secondContext)

    const launchMock = mock.method(chromium, 'launch', async () => browser)
    const renderer = new PlaywrightPdfRenderer({
      contextOptions: {
        extraHTTPHeaders: {
          authorization: 'Bearer module-token',
        },
      },
      provider: 'playwright',
    })

    await renderer.renderFromHtml({ html: '<main>First</main>' })
    await renderer.renderFromHtml({
      contextOptions: {
        extraHTTPHeaders: {
          'x-tenant': 'tenant-1',
        },
      },
      html: '<main>Second</main>',
    })

    assert.equal(launchMock.mock.callCount(), 1)
    assert.deepEqual(browser.newContext.mock.calls[1]?.arguments, [{
      extraHTTPHeaders: {
        authorization: 'Bearer module-token',
        'x-tenant': 'tenant-1',
      },
    }])

    await renderer.close()

    assert.equal(browser.close.mock.callCount(), 1)
  })

  void it('wraps Playwright rendering errors', async () => {
    const page = createPageMock(Buffer.from('pdf'))
    page.setContent.mock.mockImplementation(async () => {
      throw new Error('set content failed')
    })
    const context = createContextMock(page)
    const browser = createBrowserMock(context)
    mock.method(chromium, 'launch', async () => browser)
    const renderer = new PlaywrightPdfRenderer({ provider: 'playwright' })

    await assert.rejects(
      async () => await renderer.renderFromHtml({ html: '<main />' }),
      PdfRenderError,
    )
    assert.equal(context.close.mock.callCount(), 1)
  })
})

function createPageMock (pdf: Buffer) {
  return {
    emulateMedia: mock.fn(async () => undefined),
    goto: mock.fn(async () => undefined),
    pdf: mock.fn(async () => pdf),
    setContent: mock.fn(async () => undefined),
  }
}

function createContextMock (page: ReturnType<typeof createPageMock>) {
  return {
    close: mock.fn(async () => undefined),
    newPage: mock.fn(async () => page),
  }
}

function createBrowserMock (context: ReturnType<typeof createContextMock>) {
  return {
    close: mock.fn(async () => undefined),
    isConnected: mock.fn(() => true),
    newContext: mock.fn(async () => context),
  }
}
