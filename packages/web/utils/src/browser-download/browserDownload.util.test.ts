import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { BrowserDownloadUtil } from './browserDownload.util'

describe('BrowserDownloadUtil', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('downloads a URL through an anchor element', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    BrowserDownloadUtil.downloadUrl('https://example.com/file.pdf', {
      filename: 'file.pdf',
      rel: 'noopener',
      target: '_blank',
    })

    expect(clickSpy).toHaveBeenCalledOnce()
    expect(document.body.children).toHaveLength(0)
  })

  it('downloads a blob through an object URL', () => {
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const downloadUrlSpy = vi.spyOn(BrowserDownloadUtil, 'downloadUrl').mockImplementation(() => {})
    const blob = new Blob(['content'], { type: 'application/pdf' })

    BrowserDownloadUtil.downloadBlob(blob, { filename: 'file.pdf' })

    expect(createObjectUrlSpy).toHaveBeenCalledWith(blob)
    expect(downloadUrlSpy).toHaveBeenCalledWith('blob:mock-url', { filename: 'file.pdf' })
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:mock-url')
  })
})
