import { describe, expect, it } from 'vitest'

import { PdfPageSizeUtil } from '@/utils/pdfPageSize.util'

describe('PdfPageSizeUtil', () => {
  it('returns standard A4 size in millimeters', () => {
    expect(PdfPageSizeUtil.getSize('a4', 'mm')).toEqual({
      height: 297,
      width: 210,
    })
  })

  it('applies landscape orientation', () => {
    expect(PdfPageSizeUtil.getSize('a4', 'mm', { orientation: 'landscape' })).toEqual({
      height: 210,
      width: 297,
    })
  })

  it('converts A4 to pixels', () => {
    expect(PdfPageSizeUtil.getSize('a4', 'px', { dpi: 96 })).toEqual({
      height: 1122.5197,
      width: 793.7008,
    })
  })

  it('supports custom sizes', () => {
    expect(PdfPageSizeUtil.getSize({ height: 297, unit: 'mm', width: 240 }, 'mm')).toEqual({
      height: 297,
      width: 240,
    })
  })
})
