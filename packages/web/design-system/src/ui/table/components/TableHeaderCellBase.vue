<script setup lang="ts">
import { useInjectTableContext } from '@/ui/table/context/table.context'

const props = withDefaults(defineProps<{
  isCentered?: boolean
}>(), {
  isCentered: false,
  isResizable: true,
})

const {
  isGroupingEnabled, isScrolledFromLeft,
} = useInjectTableContext()
</script>

<template>
  <div
    :class="{
      'first-of-type:border-r first-of-type:border-secondary': isScrolledFromLeft,
      'justify-center': props.isCentered,
      'bg-secondary': !isGroupingEnabled,
    }"
    class="
      group relative flex h-10 items-center overflow-hidden bg-primary px-xl
      first-of-type:sticky first-of-type:z-2 first-of-type:pl-2xl
      last-of-type:pr-2xl
    "
  >
    <slot />
  </div>
</template>
