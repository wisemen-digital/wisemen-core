<script setup lang="ts">
import {
  UIText,
  useNumberFormat,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDialogTrigger from '@/components/FiltersActiveBadgeDialogTrigger.vue'
import FiltersActiveBadgeOperatorDropdown from '@/components/FiltersActiveBadgeOperatorDropdown.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  FilterWithAction,
  NumberFilter,
  NumberFilterValue,
} from '@/composables'
import { NumberFilterOperator } from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

interface OperatorOption {
  label: string
  value: string
}

const props = defineProps<{
  filter: FilterWithAction<NumberFilter>
}>()

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const numberFormat = useNumberFormat()

const filterValue = computed<NumberFilterValue>(() => values.value[props.filter.key] as NumberFilterValue)
const value = computed<number | null>(() => filterValue.value.value)

const operatorOptions = computed<OperatorOption[]>(() => [
  {
    label: i18n.t('component.filters.operator.equals'),
    value: NumberFilterOperator.EQUALS,
  },
  {
    label: i18n.t('component.filters.operator.not_equals'),
    value: NumberFilterOperator.NOT_EQUALS,
  },
  {
    label: i18n.t('component.filters.operator.greater_than_or_equals'),
    value: NumberFilterOperator.GREATER_THAN_OR_EQUALS,
  },
  {
    label: i18n.t('component.filters.operator.less_than_or_equals'),
    value: NumberFilterOperator.LESS_THAN_OR_EQUALS,
  },
])

const formattedNumber = computed<string | null>(() => {
  if (value.value === null) {
    return null
  }

  if (props.filter.customUnit !== undefined) {
    return `${numberFormat.format(value.value)} ${props.filter.customUnit}`
  }

  return Intl.NumberFormat(numberFormat.locale.value, props.filter.formatOptions).format(value.value)
})

function onOperatorChange(operator: string): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    operator: operator as NumberFilterOperator,
  }
}
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon"
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

    <FiltersActiveBadgeDialogTrigger :filter="props.filter">
      <FiltersActiveBadgeBasePart :is-interactive="true">
        <FiltersActiveBadgeValueEmptyState v-if="formattedNumber === null" />

        <UIText
          v-else
          :text="formattedNumber"
          class="text-xs text-primary"
        />
      </FiltersActiveBadgeBasePart>
    </FiltersActiveBadgeDialogTrigger>
  </FiltersActiveBadgeBase>
</template>
