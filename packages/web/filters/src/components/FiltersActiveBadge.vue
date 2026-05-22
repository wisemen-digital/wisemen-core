<script setup lang="ts">
import FiltersActiveBadgeBoolean from '@/components/FiltersActiveBadgeBoolean.vue'
import FiltersActiveBadgeDateRange from '@/components/FiltersActiveBadgeDateRange.vue'
import FiltersActiveBadgeNumber from '@/components/FiltersActiveBadgeNumber.vue'
import FiltersActiveMultiSelectBadge from '@/components/FiltersActiveMultiSelectBadge.vue'
import type {
  Filter,
  FilterWithAction,
} from '@/composables'
import { FilterType } from '@/composables'

const props = defineProps<{
  filter: FilterWithAction<Filter>
}>()
</script>

<template>
  <FiltersActiveMultiSelectBadge
    v-if="props.filter.type === FilterType.MULTI_SELECT"
    :filter="props.filter"
  />

  <FiltersActiveMultiSelectBadge
    v-else-if="props.filter.type === FilterType.MULTI_AUTOCOMPLETE"
    :filter="props.filter"
  />

  <FiltersActiveBadgeBoolean
    v-else-if="props.filter.type === FilterType.BOOLEAN"
    :filter="props.filter"
  />

  <FiltersActiveBadgeNumber
    v-else-if="props.filter.type === FilterType.NUMBER"
    :filter="props.filter"
  />

  <FiltersActiveBadgeDateRange
    v-else-if="props.filter.type === FilterType.DATE_RANGE"
    :filter="props.filter"
  />
</template>
