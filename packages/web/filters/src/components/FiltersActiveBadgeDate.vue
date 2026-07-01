<script setup lang="ts">
import type { PlainDate } from '@wisemen/vue-core-dates'
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
  DateFilter,
  DateFilterValue,
  FilterWithAction,
} from '@/composables'
import { DateFilterOperator } from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

interface OperatorOption {
  label: string
  value: string
}

const props = defineProps<{
  filter: FilterWithAction<DateFilter>
}>()

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const dateTimeFormat = useDateTimeFormat()

const filterValue = computed<DateFilterValue>(() => values.value[props.filter.key] as DateFilterValue)
const value = computed<PlainDate | null>(() => filterValue.value.value)

const operatorOptions = computed<OperatorOption[]>(() => [
  {
    label: i18n.t('component.filters.operator.is'),
    value: DateFilterOperator.IS,
  },
  {
    label: i18n.t('component.filters.operator.is_not'),
    value: DateFilterOperator.IS_NOT,
  },
  {
    label: i18n.t('component.filters.operator.before'),
    value: DateFilterOperator.BEFORE,
  },
  {
    label: i18n.t('component.filters.operator.after'),
    value: DateFilterOperator.AFTER,
  },
])

function onOperatorChange(operator: string): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    operator: operator as DateFilterOperator,
  }
}

function onNavigate(from: PlainDate): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    value: from,
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
      :disabled="props.filter.disableOperators ?? false"
      :model-value="filterValue.operator"
      :options="operatorOptions"
      @update:model-value="onOperatorChange"
    />

    <FiltersActiveBadgePartSeparator />

    <template v-if="props.filter.isPersistent ?? false">
      <FiltersActiveBadgeDateNavigation
        :filter-id="props.filter.key"
        :from="value"
        :until="value"
        @navigate="(from) => onNavigate(from)"
      >
        <FiltersActiveBadgeDialogTrigger :filter="props.filter">
          <FiltersActiveBadgeBasePart :is-interactive="true">
            <FiltersActiveBadgeValueEmptyState v-if="value === null" />

            <UIText
              v-else
              :text="dateTimeFormat.formatPlainDate(value)"
              class="text-xs text-primary tabular-nums"
            />
          </FiltersActiveBadgeBasePart>
        </FiltersActiveBadgeDialogTrigger>
      </FiltersActiveBadgeDateNavigation>
    </template>

    <template v-else>
      <FiltersActiveBadgeDialogTrigger :filter="props.filter">
        <FiltersActiveBadgeBasePart :is-interactive="true">
          <FiltersActiveBadgeValueEmptyState v-if="value === null" />

          <UIText
            v-else
            :text="dateTimeFormat.formatPlainDate(value)"
            class="text-xs text-primary tabular-nums"
          />
        </FiltersActiveBadgeBasePart>
      </FiltersActiveBadgeDialogTrigger>
    </template>
  </FiltersActiveBadgeBase>
</template>
