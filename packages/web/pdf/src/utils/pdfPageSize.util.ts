import type {
  PdfCustomPageSize,
  PdfNamedPageFormat,
  PdfOrientation,
  PdfPageFormat,
  PdfPageSize,
  PdfPageSizeUnit,
} from '@/types/pdfPageFormat.type'

interface GetSizeOptions {
  dpi?: number
  orientation?: PdfOrientation
}

const DEFAULT_DPI = 96
const MM_PER_INCH = 25.4

const NAMED_PAGE_SIZES_IN_MM: Record<PdfNamedPageFormat, PdfPageSize> = {
  a0: { height: 1189, width: 841 },
  a1: { height: 841, width: 594 },
  a2: { height: 594, width: 420 },
  a3: { height: 420, width: 297 },
  a4: { height: 297, width: 210 },
  a5: { height: 210, width: 148 },
  a6: { height: 148, width: 105 },
  legal: { height: 356, width: 216 },
  letter: { height: 279, width: 216 },
}

export class PdfPageSizeUtil {
  static getSize(format: PdfPageFormat, unit: PdfPageSizeUnit = 'mm', options: GetSizeOptions = {}): PdfPageSize {
    const sizeInMm = this.getSizeInMm(format)
    const orientedSize = this.applyOrientation(sizeInMm, options.orientation ?? 'portrait')

    return this.convertSize(orientedSize, 'mm', unit, options.dpi ?? DEFAULT_DPI)
  }

  static toCssSize(format: PdfPageFormat, options: GetSizeOptions = {}): Record<'height' | 'width', string> {
    const size = this.getSize(format, this.getFormatUnit(format), options)

    return {
      height: `${size.height}${this.getFormatUnit(format)}`,
      width: `${size.width}${this.getFormatUnit(format)}`,
    }
  }

  static toCssVariables(format: PdfPageFormat, options: GetSizeOptions = {}): Record<string, string> {
    const size = this.toCssSize(format, options)

    return {
      '--pdf-page-height': size.height,
      '--pdf-page-width': size.width,
    }
  }

  static convertSize(size: PdfPageSize, fromUnit: PdfPageSizeUnit, toUnit: PdfPageSizeUnit, dpi = DEFAULT_DPI): PdfPageSize {
    if (fromUnit === toUnit) {
      return {
        height: size.height,
        width: size.width,
      }
    }

    const sizeInInches = {
      height: this.convertUnit(size.height, fromUnit, 'in', dpi),
      width: this.convertUnit(size.width, fromUnit, 'in', dpi),
    }

    return {
      height: this.round(this.convertUnit(sizeInInches.height, 'in', toUnit, dpi)),
      width: this.round(this.convertUnit(sizeInInches.width, 'in', toUnit, dpi)),
    }
  }

  private static getSizeInMm(format: PdfPageFormat): PdfPageSize {
    if (this.isCustomPageSize(format)) {
      return this.convertSize(format, format.unit, 'mm')
    }

    return NAMED_PAGE_SIZES_IN_MM[format]
  }

  private static getFormatUnit(format: PdfPageFormat): PdfPageSizeUnit {
    if (this.isCustomPageSize(format)) {
      return format.unit
    }

    return 'mm'
  }

  private static applyOrientation(size: PdfPageSize, orientation: PdfOrientation): PdfPageSize {
    const isLandscapeSize = size.width > size.height

    if (orientation === 'landscape' && !isLandscapeSize) {
      return {
        height: size.width,
        width: size.height,
      }
    }

    if (orientation === 'portrait' && isLandscapeSize) {
      return {
        height: size.width,
        width: size.height,
      }
    }

    return size
  }

  private static convertUnit(value: number, fromUnit: PdfPageSizeUnit, toUnit: PdfPageSizeUnit, dpi: number): number {
    if (fromUnit === toUnit) {
      return value
    }

    if (fromUnit === 'mm' && toUnit === 'in') {
      return value / MM_PER_INCH
    }

    if (fromUnit === 'in' && toUnit === 'mm') {
      return value * MM_PER_INCH
    }

    if (fromUnit === 'px' && toUnit === 'in') {
      return value / dpi
    }

    if (fromUnit === 'in' && toUnit === 'px') {
      return value * dpi
    }

    return this.convertUnit(this.convertUnit(value, fromUnit, 'in', dpi), 'in', toUnit, dpi)
  }

  private static isCustomPageSize(format: PdfPageFormat): format is PdfCustomPageSize {
    return typeof format !== 'string'
  }

  private static round(value: number): number {
    return Number(value.toFixed(4))
  }
}
