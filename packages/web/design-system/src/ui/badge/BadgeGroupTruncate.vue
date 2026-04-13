<script setup lang="ts">
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import AdaptiveContent from '@/ui/adaptive-content/AdaptiveContent.vue'
import AdaptiveContentBlock from '@/ui/adaptive-content/AdaptiveContentBlock.vue'
import type { BadgeProps } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'
import BadgeGroup from '@/ui/badge/BadgeGroup.vue'
import BadgeLabel from '@/ui/badge/BadgeLabel.vue'

interface BadgeData {
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
          :variant="props.variant"
          :size="props.size"
        >
          <BadgeLabel :label="badge.label" />
        </Badge>
      </AdaptiveContentBlock>

      <ActionTooltip
        v-if="(hiddenBlockCount + hiddenBadgeCount) > 0"
        :label="getHiddenBadgesLabels(hiddenBlockCount + hiddenBadgeCount)"
      >
        <Badge
          :color="props.color"
          :variant="props.variant"
          :size="props.size"
        >
          <BadgeLabel :label="getOverflowBadgeLabel(hiddenBlockCount + hiddenBadgeCount)" />
        </Badge>
      </ActionTooltip>
    </BadgeGroup>
  </AdaptiveContent>
</template>
