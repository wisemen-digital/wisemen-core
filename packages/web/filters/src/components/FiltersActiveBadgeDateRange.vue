<script setup lang="ts">
import type { PlainDateRange } from '@wisemen/vue-core-dates'
import { useDateTimeFormat } from '@wisemen/vue-core-dates'
import { UIText } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDialogTrigger from '@/components/FiltersActiveBadgeDialogTrigger.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  DateRangeFilter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<DateRangeFilter>
}>()

const {
  values,
} = useInjectFiltersContext()

const dateTimeFormat = useDateTimeFormat()

const value = computed<PlainDateRange>(() => values.value[props.filter.key] as PlainDateRange)
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon ?? null"
      :label="props.filter.label"
    />

    <FiltersActiveBadgePartSeparator />

    <FiltersActiveBadgeDialogTrigger :filter="props.filter">
      <FiltersActiveBadgeBasePart :is-interactive="true">
        <FiltersActiveBadgeValueEmptyState v-if="value.from === null || value.until === null" />

        <UIText
          v-else
          :text="dateTimeFormat.formatPlainDateRange(value)"
          class="text-xs text-primary"
        />
      </FiltersActiveBadgeBasePart>
    </FiltersActiveBadgeDialogTrigger>
  </FiltersActiveBadgeBase>
</template>
