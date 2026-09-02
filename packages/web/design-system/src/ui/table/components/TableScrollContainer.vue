<script setup lang="ts">
import {
  computed,
  onMounted,
  useTemplateRef,
} from 'vue'

import { useInjectTableContext } from '@/ui/table/context/table.context'
import { useInjectTableScrollContainerContext } from '@/ui/table/context/tableScrollContainer.context'

const props = withDefaults(defineProps<{
  isScrollDisabled?: boolean
  /**
   * @deprecated Use `isScrollDisabled` instead.
   */
  disableScroll?: boolean
}>(), {
  isScrollDisabled: false,
})

const isScrollDisabled = computed<boolean>(() => props.isScrollDisabled || props.disableScroll === true)

const {
  gridTemplateColumns,
  setScrollContainer,
  variant,
} = useInjectTableContext()

const scrollContainerEl = useInjectTableScrollContainerContext(null)

const containerEl = useTemplateRef<HTMLElement>('containerEl')

onMounted(() => {
  if (containerEl.value === null) {
    return
  }

  setScrollContainer(containerEl.value)

  if (scrollContainerEl !== null) {
    scrollContainerEl.value = containerEl.value
  }
})
</script>

<template>
  <div
    ref="containerEl"
    :class="{
      'rounded-xl border border-secondary': variant === 'contained' && !isScrollDisabled,
      'overflow-auto': !isScrollDisabled,
    }"
    class="max-h-full w-full contain-layout contain-paint outline-none"
  >
    <div
      :style="{ gridTemplateColumns }"
      class="grid"
    >
      <slot />
    </div>

    <slot name="outside-grid" />
  </div>
</template>
