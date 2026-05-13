import { describe, expect, it } from 'vitest'

import { PdfFilenameUtil } from '@/utils/pdfFilename.util'

describe('PdfFilenameUtil', () => {
  it('adds missing extension', () => {
    expect(PdfFilenameUtil.ensureExtension('invoice')).toBe('invoice.pdf')
  })

  it('does not duplicate existing extension', () => {
    expect(PdfFilenameUtil.ensureExtension('invoice.pdf')).toBe('invoice.pdf')
  })

  it('slugifies filenames', () => {
    expect(PdfFilenameUtil.slugify('Project Café Order.pdf')).toBe('project-cafe-order.pdf')
  })
})
