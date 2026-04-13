<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { useProvideLayoutStackContext } from '@/components/layout-stack/layoutStack.context'

const currentStack = ref<string[]>([])

function addToStack(layoutId: string): number {
  currentStack.value.push(layoutId)

  return currentStack.value.length - 1
}

function removeFromStack(layoutId: string): void {
  currentStack.value = currentStack.value.filter((id) => id !== layoutId)
}

function getDepth(layoutId: string): number {
  return currentStack.value.toReversed().indexOf(layoutId)
}

useProvideLayoutStackContext({
  addToStack,
  getDepth,
  removeFromStack,
  stack: computed<string[]>(() => currentStack.value),
})
</script>

<template>
  <slot />
</template>
