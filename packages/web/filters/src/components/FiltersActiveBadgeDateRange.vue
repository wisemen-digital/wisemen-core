<script setup lang="ts">
import type {
  PlainDate,
  PlainDateRange,
} from '@wisemen/vue-core-dates'
import { useDateTimeFormat } from '@wisemen/vue-core-dates'
import { UIText } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDateNavigation from '@/components/FiltersActiveBadgeDateNavigation.vue'
import FiltersActiveBadgeDialogTrigger from '@/components/FiltersActiveBadgeDialogTrigger.vue'
import FiltersActiveBadgeOperatorDropdown from '@/components/FiltersActiveBadgeOperatorDropdown.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  DateRangeFilter,
  DateRangeFilterValue,
  FilterWithAction,
} from '@/composables'
import { DateRangeFilterOperator } from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

interface OperatorOption {
  label: string
  value: string
}

const props = defineProps<{
  filter: FilterWithAction<DateRangeFilter>
}>()

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const dateTimeFormat = useDateTimeFormat()

const filterValue = computed<DateRangeFilterValue>(() => values.value[props.filter.key] as DateRangeFilterValue)
const value = computed<PlainDateRange>(() => filterValue.value.value)

const hasValidRange = computed<boolean>(
  () => value.value.from !== null && value.value.until !== null,
)

const showNavigation = computed<boolean>(
  () => (props.filter.isPersistent ?? false) && hasValidRange.value,
)

const operatorOptions = computed<OperatorOption[]>(() => [
  {
    label: i18n.t('component.filters.operator.is_between'),
    value: DateRangeFilterOperator.IS_BETWEEN,
  },
  {
    label: i18n.t('component.filters.operator.is_not_between'),
    value: DateRangeFilterOperator.IS_NOT_BETWEEN,
  },
])

const operatorLabel = computed<string>(
  () => operatorOptions.value.find((o) => o.value === filterValue.value.operator)?.label ?? filterValue.value.operator,
)

function onOperatorChange(operator: string): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    operator: operator as DateRangeFilterOperator,
  }
}

function onNavigate(from: PlainDate, until: PlainDate): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    value: {
      from,
      until,
    },
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

    <FiltersActiveBadgeOperatorDropdown
      v-if="!(props.filter.disableOperators ?? false)"
      :model-value="filterValue.operator"
      :options="operatorOptions"
      @update:model-value="onOperatorChange"
    />

    <FiltersActiveBadgeBasePart
      v-else
      :label="operatorLabel"
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
