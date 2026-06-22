<script setup lang="ts">
import { decode } from 'blurhash'
import {
  onMounted,
  ref,
  watch,
} from 'vue'

const props = defineProps<{
  blurhash: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

function toCanvas(blurhash: string, canvas: HTMLCanvasElement): void {
  const {
    height, width,
  } = canvas

  const pixels = decode(blurhash, width, height)
  const context = canvas.getContext('2d')

  if (context === null) {
    return
  }

  const imageData = context.createImageData(width, height)

  imageData.data.set(pixels)
  context.putImageData(imageData, 0, 0)
}

function applyBlurHash(): void {
  if (canvasRef.value === null) {
    return
  }

  toCanvas(props.blurhash, canvasRef.value)
}

onMounted(() => {
  applyBlurHash()
})

watch(() => props.blurhash, () => {
  applyBlurHash()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    width="32"
    height="32"
    class="size-full"
  />
</template>
