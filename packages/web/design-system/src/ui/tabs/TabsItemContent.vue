<script setup lang="ts">
import type { Component } from 'vue'

import { UINumberBadge } from '@/ui/number-badge/index'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  isLabelHidden?: boolean
  count?: number | null
  icon?: Component
  label: string
}>(), {
  isLabelHidden: false,
  count: null,
  icon: undefined,
})
</script>

<template>
  <component
    :is="props.icon"
    v-if="props.icon != null"
    class="size-4 shrink-0"
  />
  <UIText
    :text="props.label"
    :class="{
      'sr-only': props.isLabelHidden,
    }"
    class="text-xs"
  />
  <UINumberBadge
    v-if="props.count != null"
    :value="props.count.toString()"
    size="md"
  />
</template>
