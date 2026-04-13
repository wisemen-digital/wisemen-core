<script setup lang="ts">
import { Motion } from 'motion-v'
import {
  computed,
  useAttrs,
} from 'vue'

import type { PopperSide } from '@/types/popperProps.type'

const attrs = useAttrs()
const side = computed<PopperSide>(() => attrs['data-side'] as PopperSide)

const TRANSLATE_AMOUNT = 4

function transform(side: PopperSide): {
  transform: string
} {
  switch (side) {
    case 'top':
      return {
        transform: `translateY(${TRANSLATE_AMOUNT}px) scale(0.9)`,
      }
    case 'bottom':
      return {
        transform: `translateY(-${TRANSLATE_AMOUNT}px) scale(0.9)`,
      }
    case 'left':
      return {
        transform: `translateX(${TRANSLATE_AMOUNT}px) scale(0.9)`,
      }
    case 'right':
      return {
        transform: `translateX(-${TRANSLATE_AMOUNT}px) scale(0.9)`,
      }
  }
}
</script>

<template>
  <Motion
    :initial="{
      opacity: 0,
      ...transform(side),
    }"
    :animate="{
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    }"
    :exit="{
      opacity: 0,
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
