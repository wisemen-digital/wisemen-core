<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

import { UIDot } from '@/ui/dot/index'
import { UINumberBadge } from '@/ui/number-badge/index'
import type {
  TabsItemConfig,
  TabsItemIndicatorConfig,
  TabsItemLeftConfig,
} from '@/ui/tabs/tabs.type'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  isLabelHidden?: boolean
  config?: TabsItemConfig | null
  /** @deprecated Use `config.indicator` instead. */
  count?: number | null
  /** @deprecated Use `config.left` instead. */
  icon?: Component
  label: string
}>(), {
  isLabelHidden: false,
  config: null,
  count: null,
  icon: undefined,
})

type ResolvedLeft = TabsItemLeftConfig | { type: 'none' }

const resolvedLeft = computed<ResolvedLeft>(() => {
  if (props.config?.left != null) {
    return props.config.left
  }

  // Fallback for the deprecated `icon` prop, kept working until removed.
  if (props.icon != null) {
    return {
      icon: props.icon,
      type: 'icon',
    }
  }

  return {
    type: 'none',
  }
})

type ResolvedIndicator = TabsItemIndicatorConfig | { type: 'none' }

const resolvedIndicator = computed<ResolvedIndicator>(() => {
  if (props.config?.indicator != null) {
    return props.config.indicator
  }

  // Fallback for the deprecated `count` prop, kept working until removed.
  if (props.count != null) {
    return {
      type: 'count',
      value: props.count,
    }
  }

  return {
    type: 'none',
  }
})
</script>

<template>
  <component
    :is="resolvedLeft.icon"
    v-if="resolvedLeft.type === 'icon'"
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
    v-if="resolvedIndicator.type === 'count'"
    :value="resolvedIndicator.value.toString()"
    size="md"
  />
  <UIDot
    v-else-if="resolvedIndicator.type === 'dot'"
    :color="resolvedIndicator.color ?? 'error'"
    size="sm"
  />
</template>
