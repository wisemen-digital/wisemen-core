<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import AdaptiveContent from '@/ui/adaptive-content/AdaptiveContent.vue'
import AdaptiveContentBlock from '@/ui/adaptive-content/AdaptiveContentBlock.vue'
import type { BadgeProps } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'
import BadgeGroup from '@/ui/badge/BadgeGroup.vue'
import type { DotColor } from '@/ui/dot/dot.props'

export interface BadgeData {
  avatar?: {
    name: string
    src?: string | null
  } | null
  dot?: {
    color: DotColor
  } | null
  icon?: Component | null
  label: string
}

const props = withDefaults(defineProps<{
  badges: BadgeData[]
  color: BadgeProps['color']
  maxVisibleCount?: number | null
  size: BadgeProps['size']
  variant: BadgeProps['variant']
}>(), {
  maxVisibleCount: null,
})

const maxVisibleBadges = computed<BadgeData[]>(() => {
  if (props.maxVisibleCount === null) {
    return props.badges
  }

  return props.badges.slice(0, props.maxVisibleCount)
})

const hiddenBadgeCount = computed<number>(() => {
  if (props.maxVisibleCount === null) {
    return 0
  }

  return Math.max(0, props.badges.length - props.maxVisibleCount)
})

function isAllBadgesHidden(hiddenCount: number): boolean {
  return hiddenCount === props.badges.length
}

function getOverflowBadgeLabel(hiddenCount: number): string {
  if (isAllBadgesHidden(hiddenCount)) {
    return `${hiddenCount} selected`
  }

  return `+${hiddenCount}`
}

function getHiddenBadgesLabels(hiddenCount: number): string {
  return props.badges.slice(-hiddenCount).map((b) => b.label).join(', ')
}
</script>

<template>
  <AdaptiveContent v-slot="{ hiddenBlockCount }">
    <BadgeGroup :no-wrap="true">
      <AdaptiveContentBlock
        v-for="(badge, badgeIndex) of maxVisibleBadges"
        :key="badge.label"
        :priority="badgeIndex"
      >
        <Badge
          :color="props.color"
          :dot="badge.dot"
          :avatar="badge.avatar"
          :icon="badge.icon"
          :label="badge.label"
          :variant="props.variant"
          :size="props.size"
        />
      </AdaptiveContentBlock>

      <ActionTooltip
        v-if="(hiddenBlockCount + hiddenBadgeCount) > 0"
        :label="getHiddenBadgesLabels(hiddenBlockCount + hiddenBadgeCount)"
      >
        <Badge
          :color="props.color"
          :label="getOverflowBadgeLabel(hiddenBlockCount + hiddenBadgeCount)"
          :variant="props.variant"
          :size="props.size"
        />
      </ActionTooltip>
    </BadgeGroup>
  </AdaptiveContent>
</template>
