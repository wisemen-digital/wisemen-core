declare module 'html2pdf.js' {
  interface Html2PdfWorker {
    from: (element: HTMLElement | null) => Html2PdfWorker
    get: (key: string) => Promise<{
      output: (type: 'blob') => Promise<Blob>
    }>
    save: (filename?: string) => Promise<void>
    set: (options: Record<string, unknown>) => Html2PdfWorker
    toContainer: () => Html2PdfWorker
    toPdf: () => Html2PdfWorker
  }

  const html2pdf: () => Html2PdfWorker

  export default html2pdf
}
