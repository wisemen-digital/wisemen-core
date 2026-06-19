<script setup lang="ts">
import type {
  PlainDate,
  PlainDateRange,
} from '@wisemen/vue-core-dates'
import { useDateTimeFormat } from '@wisemen/vue-core-dates'
import { UIText } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDateNavigation from '@/components/FiltersActiveBadgeDateNavigation.vue'
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

const hasValidRange = computed<boolean>(
  () => value.value.from !== null && value.value.until !== null,
)

const showNavigation = computed<boolean>(
  () => (props.filter.isPersistent ?? false) && hasValidRange.value,
)

function onNavigate(from: PlainDate, until: PlainDate): void {
  values.value[props.filter.key] = {
    from,
    until,
  }
}
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon ?? null"
      :label="props.filter.label"
    />

    <FiltersActiveBadgePartSeparator />

    <template v-if="showNavigation">
      <FiltersActiveBadgeDateNavigation
        :filter-id="props.filter.key"
        :from="value.from"
        :until="value.until"
        @navigate="onNavigate"
      >
        <FiltersActiveBadgeDialogTrigger :filter="props.filter">
          <FiltersActiveBadgeBasePart :is-interactive="true">
            <UIText
              :text="dateTimeFormat.formatPlainDateRange(value)"
              class="text-xs text-primary"
            />
          </FiltersActiveBadgeBasePart>
        </FiltersActiveBadgeDialogTrigger>
      </FiltersActiveBadgeDateNavigation>
    </template>

    <template v-else>
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
    </template>
  </FiltersActiveBadgeBase>
</template>
