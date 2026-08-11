<script setup lang="ts">
import { computed } from 'vue'

import { useSegmentedControlIndicator } from '@/ui/segmented-control/segmentedControl.composable'
import { useInjectSegmentedControlContext } from '@/ui/segmented-control/segmentedControl.context'

const props = defineProps<{
  listRef: HTMLElement | null
}>()

const {
  modelValue, variants,
} = useInjectSegmentedControlContext()

const activeValue = computed<string | null>(() => modelValue.value as string | null)
const listRef = computed<HTMLElement | null>(() => props.listRef)

const {
  isReady,
  indicatorCrossSize,
  indicatorPosition,
  indicatorSize,
} = useSegmentedControlIndicator({
  activeValue,
  listRef,
})
</script>

<template>
  <div
    v-if="isReady"
    :class="variants.indicator()"
    :style="{
      '--segmented-control-indicator-cross-size': indicatorCrossSize,
      '--segmented-control-indicator-position': indicatorPosition,
      '--segmented-control-indicator-size': indicatorSize,
    }"
    aria-hidden="true"
  >
    <div :class="variants.indicatorInner()" />
  </div>
</template>
