export class PdfFilenameUtil {
  static ensureExtension(filename: string, extension = 'pdf'): string {
    const normalizedExtension = extension.replace(/^\./u, '')

    if (filename.toLowerCase().endsWith(`.${normalizedExtension.toLowerCase()}`)) {
      return filename
    }

    return `${filename}.${normalizedExtension}`
  }

  static slugify(filename: string): string {
    return filename
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/gu, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9.]+/gu, '-')
      .replace(/-{2,}/gu, '-')
      .replace(/^-|-$/gu, '')
  }
}
