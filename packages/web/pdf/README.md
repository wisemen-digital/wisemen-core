# @wisemen/vue-core-pdf

Shared Vue PDF primitives and utilities.

## Install styles

Import the package stylesheet once in the consuming app:

```ts
import '@wisemen/vue-core-pdf/style.css'
```

## Layout primitives

```vue
<script setup lang="ts">
import {
  PdfDocument,
  PdfPage,
} from '@wisemen/vue-core-pdf'
</script>

<template>
  <PdfDocument format="a4">
    <PdfPage padding="20mm" shadow>
      Content
    </PdfPage>
  </PdfDocument>
</template>
```

Custom page sizes are supported:

```vue
<PdfPage :format="{ width: 240, height: 297, unit: 'mm' }" />
```

## Headless HTML preview viewer

`PdfHtmlPreviewViewer` provides scroll-container pagination and zoom state while leaving the toolbar UI to the consuming app.

```vue
<PdfHtmlPreviewViewer>
  <template #toolbar="{ currentPage, totalPages, nextPage, previousPage, zoom, zoomIn, zoomOut }">
    <button @click="previousPage">
      Previous
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="nextPage">
      Next
    </button>
    <button @click="zoomOut">
      -
    </button>
    <span>{{ zoom }}%</span>
    <button @click="zoomIn">
      +
    </button>
  </template>

  <PdfDocument format="a4">
    <PdfPage padding="20mm">
      Page 1
    </PdfPage>
  </PdfDocument>
</PdfHtmlPreviewViewer>
```

## Utilities

```ts
PdfPageSizeUtil.getSize('a4', 'mm')
PdfFilenameUtil.ensureExtension('invoice')
```

Use `BrowserDownloadUtil` from `@wisemen/vue-core-utils` for generic browser-only URL and Blob downloads.

## Composables

- `usePdfObjectUrl()` creates and revokes object URLs safely.
- `usePdfViewerPagination()` observes rendered pages in a scroll container.
- `usePdfLocale()` temporarily applies a locale while a PDF route is mounted.

## Optional html2pdf adapter

Client-side PDF generation is available from a separate subpath export:

```ts
import {
  Html2PdfGenerator,
  type Html2PdfGeneratorExpose,
} from '@wisemen/vue-core-pdf/html2pdf'
```

The consuming application must install `html2pdf.js`:

```sh
pnpm add html2pdf.js
```

Example:

```vue
<script setup lang="ts">
import {
  Html2PdfGenerator,
  type Html2PdfCanvasOptions,
  type Html2PdfGeneratorExpose,
  type Html2PdfOptions,
  type Html2PdfPagebreakOptions,
} from '@wisemen/vue-core-pdf/html2pdf'
import { ref } from 'vue'

const generator = ref<Html2PdfGeneratorExpose | null>(null)

const pagebreak: Html2PdfPagebreakOptions = {
  avoid: ['.keep-together', '.line-item'],
  before: ['.new-page'],
  mode: ['css', 'legacy'],
}

const html2canvas: Html2PdfCanvasOptions = {
  scale: 3,
  useCORS: true,
}

const options: Html2PdfOptions = {
  margin: 0,
}

async function download(): Promise<void> {
  await generator.value?.download()
}
</script>

<template>
  <button @click="download">
    Download PDF
  </button>

  <Html2PdfGenerator
    ref="generator"
    filename="order.pdf"
    format="a5"
    :html2canvas="html2canvas"
    :options="options"
    :pagebreak="pagebreak"
  >
    <div class="h-[var(--html2pdf-page-height)] w-[var(--html2pdf-page-width)] bg-white">
      PDF content
    </div>
  </Html2PdfGenerator>
</template>
```

The adapter exposes:

```ts
interface Html2PdfGeneratorExpose {
  closePreview: () => void
  download: () => Promise<Blob>
  generate: () => Promise<Blob>
  generatedBlob: Blob | null
  generationState: Html2PdfGenerationState
  isGenerating: boolean
  preview: () => Promise<string>
  previewUrl: string | null
  progress: number
  revokePreviewUrl: () => void
}
```

Notes:

- Importing from `@wisemen/vue-core-pdf/html2pdf` keeps `html2pdf.js` out of the root package entry.
- `html2pdf.js` is browser-only and relatively heavy; lazy-load routes/components that use it where possible.
- `html2pdf.js` rasterizes DOM through canvas. Prefer server-generated PDFs for official/legal/email documents.
- The adapter provides `--html2pdf-page-width` and `--html2pdf-page-height` CSS variables to slotted content.
- Pagebreak selectors default to `.custom-page-break-before`, `.custom-page-break-after`, and `.custom-page-break-avoid`.
- Pass `pagebreak` explicitly for business-critical templates; prefer semantic classes such as `.keep-together`, `.new-page`, or `.line-item` over layout-dependent selectors.
- `html2canvas`, `jsPdf`, `image`, and `options` props let consuming apps tune rendering while preserving package defaults.
- Dedicated props are merged after nested `options` values, so `:html2canvas="{ scale: 3 }"` overrides `:options="{ html2canvas: { scale: 2 } }"`.
