<script setup lang="ts">
import { computed } from 'vue'

import type {
  PdfOrientation,
  PdfPageFormat,
} from '@/types/pdfPageFormat.type'
import { PdfPageSizeUtil } from '@/utils/pdfPageSize.util'

const props = withDefaults(defineProps<{
  format?: PdfPageFormat
  orientation?: PdfOrientation
  pageGap?: string
  isPrintColorExact?: boolean
}>(), {
  format: 'a4',
  orientation: 'portrait',
  pageGap: '16mm',
  isPrintColorExact: true,
})

const cssVariables = computed<Record<string, string>>(() => ({
  ...PdfPageSizeUtil.toCssVariables(props.format, {
    orientation: props.orientation,
  }),
  '--pdf-page-gap': props.pageGap,
}))
</script>

<template>
  <div
    :class="{
      'pdf-document--print-color-exact': props.isPrintColorExact,
    }"
    :style="cssVariables"
    class="pdf-document"
  >
    <slot />
  </div>
</template>

<style>
.pdf-document {
  display: flex;
  flex-direction: column;
  gap: var(--pdf-page-gap);
}

.pdf-document--print-color-exact {
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

@media print {
  .pdf-document {
    gap: 0;
  }
}
</style>
