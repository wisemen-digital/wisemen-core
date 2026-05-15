<script setup lang="ts">
import { BrowserDownloadUtil } from '@wisemen/vue-core-utils'
import html2pdf from 'html2pdf.js'
import {
  computed,
  ref,
} from 'vue'

import { usePdfObjectUrl } from '@/composables/pdf-object-url'
import type { PdfNamedPageFormat } from '@/types/pdfPageFormat.type'
import { PdfPageSizeUtil } from '@/utils/pdfPageSize.util'
import type {
  Html2PdfBeforeGeneratePayload,
  Html2PdfCanvasOptions,
  Html2PdfGenerateResult,
  Html2PdfImageOptions,
  Html2PdfImageType,
  Html2PdfJsPdfOptions,
  Html2PdfOptions,
  Html2PdfPagebreakOptions,
} from './html2Pdf.types'

const props = withDefaults(defineProps<{
  filename: string
  format?: PdfNamedPageFormat
  html2canvas?: Html2PdfCanvasOptions
  imageQuality?: number
  image?: Html2PdfImageOptions
  imageType?: Html2PdfImageType
  isDownloadEnabled?: boolean
  isImageFixEnabled?: boolean
  isPreviewEnabled?: boolean
  jsPdf?: Html2PdfJsPdfOptions
  options?: Html2PdfOptions
  pagebreak?: Html2PdfPagebreakOptions
  previewTitle?: string
  quality?: number
}>(), {
  format: 'a4',
  imageQuality: 1,
  imageType: 'jpeg',
  isDownloadEnabled: true,
  isImageFixEnabled: true,
  isPreviewEnabled: false,
  pagebreak: () => ({
    after: [
      '.pdf-page-break-after',
      '.custom-page-break-after',
    ],
    avoid: [
      '.pdf-page-break-avoid',
      '.pdf-keep-together',
      '.custom-page-break-avoid',
    ],
    before: [
      '.pdf-page-break-before',
      '.custom-page-break-before',
    ],
    mode: ['css', 'legacy'],
  }),
  previewTitle: 'PDF preview',
  quality: 2,
})

const emit = defineEmits<{
  beforeGenerate: [payload: Html2PdfBeforeGeneratePayload]
  downloaded: [blob: Blob]
  error: [error: unknown]
  generated: [payload: Html2PdfGenerateResult]
  paginated: []
  progress: [progress: number]
  startPagination: []
}>()

const pdfContentRef = ref<HTMLElement | null>(null)
const generatedBlob = ref<Blob | null>(null)
const isGenerating = ref<boolean>(false)
const progress = ref<number>(0)
const previewUrl = ref<string | null>(null)

const {
  revoke: revokePreviewUrl,
  setBlob: setPreviewBlob,
} = usePdfObjectUrl()

const pdfFormatPixels = computed(() => PdfPageSizeUtil.getSize(props.format, 'px'))

const pdfContentStyle = computed<Record<string, string>>(() => ({
  '--html2pdf-page-height': `${pdfFormatPixels.value.height}px`,
  '--html2pdf-page-width': `${pdfFormatPixels.value.width}px`,
  'minHeight': `${pdfFormatPixels.value.height}px`,
  'width': `${pdfFormatPixels.value.width}px`,
}))

function setProgress(value: number): void {
  progress.value = value
  emit('progress', value)
}

const generationState = computed(() => ({
  blob: generatedBlob.value,
  isGenerating: isGenerating.value,
  previewUrl: previewUrl.value,
  progress: progress.value,
}))

function createOptions(): Html2PdfOptions {
  return {
    ...props.options,
    enableLinks: props.options?.enableLinks ?? true,
    filename: props.options?.filename ?? props.filename,
    hotfix: [
      'px_scaling',
      ...(props.options?.hotfix ?? []),
    ],
    html2canvas: {
      letterRendering: false,
      scale: props.quality,
      useCORS: true,
      ...props.options?.html2canvas,
      ...props.html2canvas,
    },
    image: {
      quality: props.imageQuality,
      type: props.imageType,
      ...props.options?.image,
      ...props.image,
    },
    jsPDF: {
      format: [
        pdfFormatPixels.value.width,
        pdfFormatPixels.value.height,
      ],
      precision: 1,
      unit: 'px',
      ...props.options?.jsPDF,
      ...props.jsPdf,
    },
    margin: props.options?.margin ?? [
      0,
      0,
      0,
      0,
    ],
    pagebreak: props.pagebreak ?? props.options?.pagebreak,
  }
}

async function withImageFix<T>(callback: () => Promise<T>): Promise<T> {
  if (!props.isImageFixEnabled) {
    return await callback()
  }

  const style = document.createElement('style')

  document.head.appendChild(style)
  style.sheet?.insertRule('body > div:last-child img { display: inline-block; width: auto; height: auto; }')

  try {
    return await callback()
  } finally {
    style.remove()
  }
}

async function generate(): Promise<Blob> {
  const element = pdfContentRef.value

  if (element === null) {
    throw new Error('PDF content element is not mounted')
  }

  emit('startPagination')
  isGenerating.value = true
  setProgress(0)
  setProgress(25)
  emit('paginated')

  const options = createOptions()

  emit('beforeGenerate', {
    element,
    options,
  } as Html2PdfBeforeGeneratePayload)

  try {
    const blob = await withImageFix(async () => {
      const pdf = await html2pdf()
        .set(options as Record<string, unknown>)
        .from(element)
        .toContainer()
        .toPdf()
        .get('pdf')

      return await pdf.output('blob') as Blob
    })

    const objectUrl = setPreviewBlob(blob)

    generatedBlob.value = blob
    previewUrl.value = objectUrl
    setProgress(100)

    emit('generated', {
      blob,
      objectUrl,
    })

    return blob
  } catch (error) {
    emit('error', error)

    throw error
  } finally {
    isGenerating.value = false
  }
}

async function download(): Promise<Blob> {
  const blob = await generate()

  if (!props.isDownloadEnabled) {
    return blob
  }

  BrowserDownloadUtil.downloadBlob(blob, {
    filename: props.filename,
  })

  emit('downloaded', blob)

  return blob
}

async function preview(): Promise<string> {
  await generate()

  if (previewUrl.value === null) {
    throw new Error('PDF preview URL was not created')
  }

  return previewUrl.value
}

function revokeGeneratedObjectUrl(): void {
  revokePreviewUrl()
  previewUrl.value = null
}

function closePreview(): void {
  revokeGeneratedObjectUrl()
}

defineExpose({
  closePreview,
  download,
  generate,
  generatedBlob,
  generationState,
  isGenerating,
  preview,
  previewUrl,
  progress,
  revokePreviewUrl: revokeGeneratedObjectUrl,
})
</script>

<template>
  <div class="html2pdf-generator">
    <section class="html2pdf-generator__layout-container">
      <section
        ref="pdfContentRef"
        :style="pdfContentStyle"
        class="html2pdf-generator__content-wrapper"
      >
        <slot />
      </section>
    </section>

    <teleport to="body">
      <section
        v-if="props.isPreviewEnabled && previewUrl !== null"
        class="html2pdf-generator__preview"
      >
        <button
          class="html2pdf-generator__preview-close"
          type="button"
          @click="closePreview"
        >
          &times;
        </button>

        <iframe
          :src="previewUrl"
          :title="props.previewTitle"
          height="100%"
          width="100%"
        />
      </section>
    </teleport>
  </div>
</template>

<style>
.html2pdf-generator {
  position: absolute;
  z-index: -999;
}

.html2pdf-generator__layout-container {
  position: fixed;
  top: 0;
  left: -100vw;
  z-index: -9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: auto;
}

.html2pdf-generator__content-wrapper {
  min-height: var(--html2pdf-page-height);
  width: var(--html2pdf-page-width);
}

.html2pdf-generator__preview {
  position: fixed;
  top: 100px;
  left: 50%;
  z-index: 9999999;
  width: 65%;
  min-width: 600px;
  height: 80vh;
  border-radius: 5px;
  box-shadow: 0 0 10px #00000048;
  transform: translateX(-50%);
}

.html2pdf-generator__preview iframe {
  border: 0;
}

.html2pdf-generator__preview-close {
  position: absolute;
  top: -20px;
  left: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  background: #555;
  box-shadow: 0 0 10px #00000048;
  cursor: pointer;
  font-size: 20px;
}
</style>
