import type { BrowserDownloadOptions } from './browserDownload.type'

export class BrowserDownloadUtil {
  /**
   * Browser-only utility for triggering a download from an existing URL.
   */
  static downloadUrl(url: string, options: BrowserDownloadOptions = {}): void {
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

  /**
   * Browser-only utility for triggering a download from a Blob.
   */
  static downloadBlob(blob: Blob, options: BrowserDownloadOptions = {}): void {
    const url = URL.createObjectURL(blob)

    try {
      this.downloadUrl(url, options)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  /**
   * Browser-only utility for opening a URL in a new tab without exposing window.opener.
   */
  static openInNewTab(url: string): void {
    const openedWindow = window.open(url, '_blank', 'noopener,noreferrer')

    if (openedWindow !== null) {
      openedWindow.opener = null
    }
  }
}
