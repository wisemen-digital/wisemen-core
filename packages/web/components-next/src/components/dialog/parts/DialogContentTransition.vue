<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <Motion
    :initial="{
      opacity: 0,
      transform: 'translateY(5rem)',
    }"
    :animate="{
      opacity: 1,
      transform: 'translateY(0rem)',
      transition: {
        duration: 0.6,
        bounce: 0,
        type: 'spring',
      },
    }"
    :exit="{
      opacity: 0,
      transform: 'translateY(5rem)',
      transition: {
        duration: 0.3,
        bounce: 0,
        type: 'spring',
      },
    }"
  >
    <slot />
  </Motion>
</template>
