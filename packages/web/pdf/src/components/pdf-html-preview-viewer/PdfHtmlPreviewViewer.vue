<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
} from 'vue'

import { usePdfViewerPagination } from '@/composables/pdf-viewer-pagination'

const props = withDefaults(defineProps<{
  initialZoom?: number
  maxZoom?: number
  minZoom?: number
  pageSelector?: string
  threshold?: number
  totalPages?: number | null
  zoomStep?: number
}>(), {
  initialZoom: 100,
  maxZoom: 200,
  minZoom: 25,
  pageSelector: '.pdf-page',
  threshold: 0.5,
  totalPages: null,
  zoomStep: 10,
})

const emit = defineEmits<{
  open: []
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const zoom = ref<number>(props.initialZoom)

const pagination = usePdfViewerPagination({
  container: scrollContainer,
  pageSelector: computed<string>(() => props.pageSelector),
  threshold: computed<number>(() => props.threshold),
  totalPages: computed<number | null>(() => props.totalPages),
})

const zoomScale = computed<number>(() => zoom.value / 100)
const canZoomIn = computed<boolean>(() => zoom.value < props.maxZoom)
const canZoomOut = computed<boolean>(() => zoom.value > props.minZoom)

function zoomIn(): void {
  zoom.value = Math.min(zoom.value + props.zoomStep, props.maxZoom)
}

function zoomOut(): void {
  zoom.value = Math.max(zoom.value - props.zoomStep, props.minZoom)
}

function resetZoom(): void {
  zoom.value = props.initialZoom
}

function observePages(): void {
  pagination.observePages()
}

function onOpen(): void {
  emit('open')
}

onMounted(async () => {
  await nextTick()

  observePages()
})

defineExpose({
  observePages,
})
</script>

<template>
  <section class="pdf-html-preview-viewer">
    <slot
      name="toolbar"
      :can-go-to-next-page="pagination.canGoToNextPage.value"
      :can-go-to-previous-page="pagination.canGoToPreviousPage.value"
      :can-zoom-in="canZoomIn"
      :can-zoom-out="canZoomOut"
      :current-page="pagination.currentPage.value"
      :go-to-page="pagination.goToPage"
      :next-page="pagination.nextPage"
      :open="onOpen"
      :previous-page="pagination.previousPage"
      :reset-zoom="resetZoom"
      :total-pages="pagination.totalPages.value"
      :zoom="zoom"
      :zoom-in="zoomIn"
      :zoom-out="zoomOut"
    />

    <div
      ref="scrollContainer"
      class="pdf-html-preview-viewer__scroll-container"
    >
      <div
        :style="{
          transform: `scale(${zoomScale})`,
        }"
        class="pdf-html-preview-viewer__content"
      >
        <slot />
      </div>
    </div>
  </section>
</template>

<style>
.pdf-html-preview-viewer {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pdf-html-preview-viewer__scroll-container {
  min-height: 0;
  overflow: auto;
}

.pdf-html-preview-viewer__content {
  width: max-content;
  min-width: 100%;
  transform-origin: top center;
}
</style>
