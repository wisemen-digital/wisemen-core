<script setup lang="ts">
import { computed } from 'vue'

import type { BadgeProps } from '@/ui/badge/badge.props'
import BadgeGroupTruncate from '@/ui/badge/BadgeGroupTruncate.vue'
import type { DataTableBadgeGroupCell } from '@/ui/data-table/types/dataTableCell.type'

const props = defineProps<DataTableBadgeGroupCell>()

const badges = computed<BadgeProps[]>(() => props.badges.map((badge) => ({
  ...badge,
  size: badge.size ?? 'sm',
})))
</script>

<template>
  <BadgeGroupTruncate
    :badges="badges"
    :max-visible-count="props.maxVisible ?? null"
  />
</template>
