<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

import { useInjectTableContext } from '@/components/table/table.context'

const {
  setTableScrollContainerRef,
} = useInjectTableContext()

const tableScrollContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (tableScrollContainerRef.value === null) {
    throw new Error('tableScrollContainerRef is null')
  }

  setTableScrollContainerRef(tableScrollContainerRef.value)
})
</script>

<template>
  <div
    ref="tableScrollContainerRef"
    class="overflow-auto"
  >
    <slot />
  </div>
</template>
