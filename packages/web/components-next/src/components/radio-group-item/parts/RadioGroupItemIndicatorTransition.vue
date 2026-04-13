<script setup lang="ts">
import { Motion } from 'motion-v'
</script>

<template>
  <Motion
    :initial="{ opacity: 0,
                scale: 1.5 }"
    :animate="{ opacity: 1,
                scale: 1 }"
    :exit="{ opacity: 0,
             scale: 1.5 }"
    :transition="{
      duration: 0.3,
      type: 'spring',
      bounce: 0,
    }"
  />
</template>
