export type PdfNamedPageFormat = 'a0'
  | 'a1'
  | 'a2'
  | 'a3'
  | 'a4'
  | 'a5'
  | 'a6'
  | 'legal'
  | 'letter'

export type PdfPageSizeUnit = 'in' | 'mm' | 'px'

export type PdfOrientation = 'landscape' | 'portrait'

export interface PdfPageSize {
  height: number
  width: number
}

export interface PdfCustomPageSize extends PdfPageSize {
  unit: PdfPageSizeUnit
}

export type PdfPageFormat = PdfCustomPageSize | PdfNamedPageFormat
