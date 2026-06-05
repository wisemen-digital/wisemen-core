<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { Motion } from 'motion-v'
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'

const props = withDefaults(defineProps<{
  duration?: number
}>(), {
  duration: 0.3,
})

const el = ref<HTMLDivElement | null>(null)
const {
  height,
} = useElementSize(el)

const isTransitionActive = ref<boolean>(false)
const isReducedMotion = useIsReducedMotion()
const duration = computed<number>(() => (isTransitionActive.value && !isReducedMotion.value) ? props.duration : 0)

onMounted(() => {
  setTimeout(() => {
    isTransitionActive.value = true
  }, 50)
})
</script>

<template>
  <Motion
    :animate="{ height }"
    :transition="{
      bounce: 0,
      duration,
      type: 'spring',
    }"
    tabindex="-1"
    class="relative flex flex-col"
  >
    <div ref="el">
      <slot />
    </div>
  </Motion>
</template>
