import type { PdfDownloadOptions } from '@/types/pdfDownloadOptions.type'

export class PdfDownloadUtil {
  static downloadUrl(url: string, options: PdfDownloadOptions = {}): void {
    const link = document.createElement('a')

    link.href = url

    if (options.filename !== undefined && options.filename !== null) {
      link.download = options.filename
    }

    if (options.target !== undefined && options.target !== null) {
      link.target = options.target
    }

    if (options.rel !== undefined && options.rel !== null) {
      link.rel = options.rel
    }

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static downloadBlob(blob: Blob, options: PdfDownloadOptions = {}): void {
    const url = URL.createObjectURL(blob)

    try {
      this.downloadUrl(url, options)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  static openInNewTab(url: string): void {
    const openedWindow = window.open(url, '_blank', 'noopener,noreferrer')

    if (openedWindow !== null) {
      openedWindow.opener = null
    }
  }
}
