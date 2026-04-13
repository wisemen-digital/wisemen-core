<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const scrollContainerRef = ref<HTMLElement | null>(null)

const {
  classConfig,
  customClassConfig,
  setScrollContainerRef,
  style,
} = useInjectTabsContext()

onMounted(() => {
  if (scrollContainerRef.value === null) {
    throw new Error('scrollContainerRef is null')
  }

  setScrollContainerRef(scrollContainerRef.value)
})
</script>

<template>
  <div
    ref="scrollContainerRef"
    :class="style.scrollContainer({
      class: mergeClasses(customClassConfig.scrollContainer, classConfig?.scrollContainer),
    })"
  >
    <slot />
  </div>
</template>
