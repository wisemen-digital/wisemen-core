<script setup lang="ts">
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import AdaptiveContent from '@/ui/adaptive-content/AdaptiveContent.vue'
import AdaptiveContentBlock from '@/ui/adaptive-content/AdaptiveContentBlock.vue'
import type { BadgeProps } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'
import BadgeGroup from '@/ui/badge/BadgeGroup.vue'

const props = withDefaults(defineProps<{
  badges: BadgeProps[]
  maxVisibleCount?: number | null
}>(), {
  maxVisibleCount: null,
})

const maxVisibleBadges = computed<BadgeProps[]>(() => {
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
        :key="badgeIndex"
        :priority="badgeIndex"
      >
        <Badge v-bind="badge" />
      </AdaptiveContentBlock>

      <ActionTooltip
        v-if="(hiddenBlockCount + hiddenBadgeCount) > 0"
        :label="getHiddenBadgesLabels(hiddenBlockCount + hiddenBadgeCount)"
      >
        <Badge
          :label="getOverflowBadgeLabel(hiddenBlockCount + hiddenBadgeCount)"
          :size="props.badges[0]?.size"
          class="pointer-events-auto cursor-default"
        />
      </ActionTooltip>
    </BadgeGroup>
  </AdaptiveContent>
</template>
