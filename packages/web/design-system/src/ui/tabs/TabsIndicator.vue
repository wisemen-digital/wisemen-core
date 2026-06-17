<script setup lang="ts">
import { TabsIndicator as RekaTabsIndicator } from 'reka-ui'
import {
  nextTick,
  ref,
  watch,
} from 'vue'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'

const {
  isResponsiveOverflowEnabled,
  activeValue,
  overflowTabs,
  variants,
} = useInjectTabsContext()

interface TabsIndicatorInstance {
  updateIndicatorStyle?: () => void
}

const indicatorRef = ref<TabsIndicatorInstance | null>(null)

function scheduleIndicatorUpdate(): void {
  void nextTick(() => {
    window.requestAnimationFrame(() => {
      indicatorRef.value?.updateIndicatorStyle?.()
    })
  })
}

watch(
  () => [
    activeValue.value,
    isResponsiveOverflowEnabled.value,
    overflowTabs.value.map((tab) => tab.id).join('|'),
  ],
  scheduleIndicatorUpdate,
  {
    flush: 'post',
  },
)
</script>

<template>
  <RekaTabsIndicator
    ref="indicatorRef"
    :class="variants.indicator()"
  >
    <div :class="variants.indicatorInner()" />
  </RekaTabsIndicator>
</template>
