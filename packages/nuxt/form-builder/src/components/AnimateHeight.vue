<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { Motion } from 'motion-v'
import { useTemplateRef } from 'vue'

const element = useTemplateRef<HTMLDivElement>('element')
const {
  height,
} = useElementSize(element)
</script>

<template>
  <Motion
    :animate="{ height }"
    :transition="{
      bounce: 0,
      duration: 0.3,
      type: 'spring',
    }"
    class="relative overflow-clip"
    tabindex="-1"
  >
    <div ref="element">
      <slot />
    </div>
  </Motion>
</template>
