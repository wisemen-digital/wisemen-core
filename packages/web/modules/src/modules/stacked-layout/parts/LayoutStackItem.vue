<script setup lang="ts">
import { Motion } from 'motion-v'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
} from 'vue'

import { useInjectLayoutStackContext } from '@/modules/stacked-layout/layoutStack.context'

const {
  addToStack,
  getDepth,
  removeFromStack,
  stack,
} = useInjectLayoutStackContext()

const layoutId = useId()
const hasFinishedEntering = ref<boolean>(false)

addToStack(layoutId)

onMounted(() => {
  setTimeout(() => {
    hasFinishedEntering.value = true
  }, 0)
})

onBeforeUnmount(() => {
  removeFromStack(layoutId)
})
</script>

<template>
  <Motion
    :as-child="false"
    :initial="{
      y: stack.length > 1 ? '20%' : undefined,
      scale: stack.length === 1 ? 1.1 : undefined,
      opacity: 0,
    }"
    :exit="{
      y: stack.length > 1 ? '20%' : undefined,
      opacity: 0,
      scale: stack.length === 1 ? 1.1 : undefined,
      transition: stack.length === 1 ? {
        duration: 0.3,
        bounce: 0,
        type: 'spring',
      } : undefined,
    }"
    :animate="{
      y: `-${getDepth(layoutId) * 1}rem`,
      scale: 1 - getDepth(layoutId) * 0.1,
      filter: `brightness(${1 - getDepth(layoutId) * 0.1}) blur(${getDepth(layoutId) * 1}px)`,
      opacity: getDepth(layoutId) > 2 ? 0 : 1,
      transition: stack.length === 1 && !hasFinishedEntering ? {
        duration: 0.6,
        bounce: 0.4,
        type: 'spring',
      } : undefined,
    }"
    :transition="{
      duration: 0.6,
      type: 'spring',
      bounce: 0.2,
    }"
    class="origin-top"
  >
    <slot />
  </Motion>
</template>
