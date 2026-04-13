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
    :initial="{
      opacity: 0,
      ...transform(side),
    }"
    :animate="{
      opacity: 1,
      x: 0,
      y: 0,
    }"
    :exit="{
      opacity: 0,
      ...transform(side),
    }"
    :transition="{
      duration: 0.1,
      type: 'spring',
      bounce: 0,
    }"
    class="
      data-[side=bottom]:origin-top
      data-[side=left]:origin-right
      data-[side=right]:origin-left
      data-[side=top]:origin-bottom
    "
  >
    <slot />
  </Motion>
</template>
