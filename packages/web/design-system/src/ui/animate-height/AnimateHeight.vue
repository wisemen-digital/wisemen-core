<script setup lang="ts">
/**
 * Animates its height when its content changes.
 */
import { useElementSize } from '@vueuse/core'
import { Motion } from 'motion-v'
import {
  onMounted,
  ref,
} from 'vue'

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
      duration: isTransitionActive ? props.duration : 0,
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
