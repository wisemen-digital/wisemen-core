<script setup lang="ts">
import {
  Motion,
  useReducedMotion,
} from 'motion-v'

const isReduceMotionEnabledOnDevice = useReducedMotion()
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
