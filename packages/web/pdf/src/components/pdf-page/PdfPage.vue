<script setup lang="ts">
import { computed } from 'vue'

import type {
  PdfOrientation,
  PdfPageFormat,
} from '@/types/pdfPageFormat.type'
import { PdfPageSizeUtil } from '@/utils/pdfPageSize.util'

const props = withDefaults(defineProps<{
  format?: PdfPageFormat | null
  orientation?: PdfOrientation
  padding?: string
  shadow?: boolean
  breakAfter?: boolean
  isPrintColorExact?: boolean
}>(), {
  format: null,
  orientation: 'portrait',
  padding: '0',
  shadow: false,
  breakAfter: true,
  isPrintColorExact: true,
})

const cssVariables = computed<Record<string, string>>(() => {
  if (props.format === null) {
    return {
      '--pdf-page-padding': props.padding,
    }
  }

  return {
    ...PdfPageSizeUtil.toCssVariables(props.format, {
      orientation: props.orientation,
    }),
    '--pdf-page-padding': props.padding,
  }
})
</script>

<template>
  <article
    :class="{
      'pdf-page--break-after': props.breakAfter,
      'pdf-page--print-color-exact': props.isPrintColorExact,
      'pdf-page--shadow': props.shadow,
    }"
    :style="cssVariables"
    class="pdf-page"
  >
    <slot />
  </article>
</template>

<style>
.pdf-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: var(--pdf-page-width);
  min-height: var(--pdf-page-height);
  padding: var(--pdf-page-padding);
  background: white;
  overflow: hidden;
}

.pdf-page--break-after {
  break-after: page;
  page-break-after: always;
}

.pdf-page--break-after:last-child {
  break-after: auto;
  page-break-after: auto;
}

.pdf-page--print-color-exact {
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-page--shadow {
  box-shadow: 0 16px 40px rgb(15 23 42 / 12%);
}

@media print {
  .pdf-page {
    width: var(--pdf-page-width);
    min-height: var(--pdf-page-height);
    box-shadow: none;
  }
}
</style>
