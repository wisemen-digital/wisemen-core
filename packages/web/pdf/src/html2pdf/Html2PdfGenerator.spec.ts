import { BrowserDownloadUtil } from '@wisemen/vue-core-utils'
import { mount } from '@vue/test-utils'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import Html2PdfGenerator from './Html2PdfGenerator.vue'
import type { Html2PdfGeneratorExpose } from './html2Pdf.types'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  get: vi.fn<() => Promise<{ output: () => Promise<Blob> }>>(),
  html2pdf: vi.fn(),
  output: vi.fn<() => Promise<Blob>>(),
  set: vi.fn(),
  toContainer: vi.fn(),
  toPdf: vi.fn(),
}))

vi.mock('html2pdf.js', () => ({
  default: mocks.html2pdf,
}))

function createHtml2PdfWorkerMock() {
  const worker = {
    from: mocks.from,
    get: mocks.get,
    set: mocks.set,
    toContainer: mocks.toContainer,
    toPdf: mocks.toPdf,
  }

  mocks.set.mockReturnValue(worker)
  mocks.from.mockReturnValue(worker)
  mocks.toContainer.mockReturnValue(worker)
  mocks.toPdf.mockReturnValue(worker)
  mocks.get.mockResolvedValue({ output: mocks.output })
  mocks.html2pdf.mockReturnValue(worker)

  return worker
}

function mountComponent(): ReturnType<typeof mount> {
  return mount(Html2PdfGenerator, {
    props: {
      filename: 'invoice.pdf',
    },
    slots: {
      default: '<div>PDF content</div>',
    },
  })
}

describe('Html2PdfGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createHtml2PdfWorkerMock()
    mocks.output.mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:pdf')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generates a PDF blob and emits the generated object URL', async () => {
    const wrapper = mountComponent()

    const generator = wrapper.vm as unknown as Html2PdfGeneratorExpose

    const blob = await generator.generate()

    expect(blob.type).toBe('application/pdf')
    expect(mocks.html2pdf).toHaveBeenCalledOnce()
    expect(mocks.set).toHaveBeenCalledOnce()
    expect(mocks.from).toHaveBeenCalledWith(expect.any(HTMLElement))
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(wrapper.emitted('generated')).toEqual([[
      {
        blob,
        objectUrl: 'blob:pdf',
      },
    ]])
  })

  it('reuses the generated object URL for preview without creating a second URL', async () => {
    const wrapper = mountComponent()

    const generator = wrapper.vm as unknown as Html2PdfGeneratorExpose

    const objectUrl = await generator.preview()

    expect(objectUrl).toBe('blob:pdf')
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
  })

  it('downloads the generated blob when downloads are enabled', async () => {
    const downloadBlobSpy = vi.spyOn(BrowserDownloadUtil, 'downloadBlob').mockImplementation(() => {})
    const wrapper = mountComponent()

    const generator = wrapper.vm as unknown as Html2PdfGeneratorExpose

    const blob = await generator.download()

    expect(downloadBlobSpy).toHaveBeenCalledWith(blob, {
      filename: 'invoice.pdf',
    })
    expect(wrapper.emitted('downloaded')).toEqual([[blob]])
  })

  it('revokes the generated object URL when closing the preview', async () => {
    const wrapper = mountComponent()

    const generator = wrapper.vm as unknown as Html2PdfGeneratorExpose

    await generator.preview()
    generator.closePreview()

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pdf')
  })
})
