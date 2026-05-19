<script setup lang="ts">
import { Motion } from 'motion-v'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'

const isReduceMotionEnabledOnDevice = useIsReducedMotion()
</script>

<template>
  <Motion
    :initial="{
      transform: 'translateX(-100%)',
    }"
    :animate="{
      transform: 'translateX(0%)',
    }"
    :exit="{
      transform: 'translateX(-100%)',
    }"
    :transition="{
      duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
      type: 'spring',
      bounce: 0,
    }"
  >
    <slot />
  </Motion>
</template>
