<script setup lang="ts">
import { Motion } from 'motion-v'
import {
  computed,
  ref,
  useAttrs,
} from 'vue'

import type { PopperSide } from '@/types/popperProps.type'

const attrs = useAttrs()
const side = computed<PopperSide>(() => attrs['data-side'] as PopperSide)

const motionRef = ref<InstanceType<any> | null>(null)

const TRANSLATE_AMOUNT = 4

function transform(side: PopperSide): { x: number
  y: number } {
  switch (side) {
    case 'top':
      return {
        x: 0,
        y: TRANSLATE_AMOUNT,
      }
    case 'bottom':
      return {
        x: 0,
        y: -TRANSLATE_AMOUNT,
      }
    case 'left':
      return {
        x: TRANSLATE_AMOUNT,
        y: 0,
      }
    case 'right':
      return {
        x: -TRANSLATE_AMOUNT,
        y: 0,
      }
  }
}
</script>

<template>
  <Motion
    ref="motionRef"
    :initial="{
      opacity: 0,
      scale: 0.9,
      ...transform(side),
    }"
    :animate="{
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
    }"
    :exit="{
      opacity: 0,
      scale: 0.9,
      ...transform(side),
    }"
    :transition="{
      duration: 0.2,
      type: 'spring',
      bounce: 0,
    }"
    class="origin-(--reka-popover-content-transform-origin)"
  >
    <slot />
  </Motion>
</template>
