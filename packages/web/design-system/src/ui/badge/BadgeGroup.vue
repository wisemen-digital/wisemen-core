<script setup lang="ts">
import { computed } from 'vue'

import { UIRowLayout } from '@/ui/row-layout/index'

const props = withDefaults(defineProps<{
  isWrapped?: boolean
  /**
   * @deprecated Use `:is-wrapped="false"` instead.
   */
  noWrap?: boolean
}>(), {
  isWrapped: true,
})

const isWrapped = computed<boolean>(() => props.noWrap === true ? false : props.isWrapped)
</script>

<template>
  <UIRowLayout
    :class="{
      'flex-wrap': isWrapped,
    }"
    gap="xs"
  >
    <slot />
  </UIRowLayout>
</template>
