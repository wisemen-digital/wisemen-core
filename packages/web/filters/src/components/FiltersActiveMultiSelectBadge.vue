<script setup lang="ts">
import {
  UIActionTooltip,
  UIText,
  useNumberFormat,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDropdownMenu from '@/components/FiltersActiveBadgeDropdownMenu.vue'
import FiltersActiveBadgeOperatorDropdown from '@/components/FiltersActiveBadgeOperatorDropdown.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  FilterWithAction,
  MultiAutocompleteFilter,
  MultiSelectFilter,
  MultiSelectFilterValue,
  SelectFilterValue,
} from '@/composables'
import { MultiSelectFilterOperator } from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

interface OperatorOption {
  label: string
  value: string
}

const props = defineProps<{
  filter: FilterWithAction<MultiAutocompleteFilter> | FilterWithAction<MultiSelectFilter>
}>()

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const filterValue = computed<MultiSelectFilterValue<SelectFilterValue>>(
  () => values.value[props.filter.key] as MultiSelectFilterValue<SelectFilterValue>,
)

const filterValues = computed<SelectFilterValue[]>(() => filterValue.value.value)

const numberFormat = useNumberFormat()

const operatorOptions = computed<OperatorOption[]>(() => [
  {
    label: filterValues.value.length > 1
      ? i18n.t('component.filters.operator.is_any_of')
      : i18n.t('component.filters.operator.is'),
    value: MultiSelectFilterOperator.INCLUDES,
  },
  {
    label: i18n.t('component.filters.operator.is_not'),
    value: MultiSelectFilterOperator.EXCLUDES,
  },
])

const operatorLabel = computed<string>(() => {
  if (filterValue.value.operator === MultiSelectFilterOperator.EXCLUDES) {
    return i18n.t('component.filters.operator.is_not')
  }

  return filterValues.value.length > 1
    ? i18n.t('component.filters.operator.is_any_of')
    : i18n.t('component.filters.operator.is')
})

function onOperatorChange(operator: string): void {
  values.value[props.filter.key] = {
    ...filterValue.value,
    operator: operator as MultiSelectFilterOperator,
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
      :label="operatorLabel"
      :model-value="filterValue.operator"
      :options="operatorOptions"
      @update:model-value="onOperatorChange"
    />

    <FiltersActiveBadgePartSeparator />

    <FiltersActiveBadgeDropdownMenu :filter="props.filter">
      <FiltersActiveBadgeBasePart :is-interactive="true">
        <FiltersActiveBadgeValueEmptyState v-if="filterValues.length === 0" />

        <UIText
          v-else-if="filterValues.length === 1"
          :text="props.filter.displayFn(filterValues[0]!)"
          class="text-xs text-primary"
        />

        <UIActionTooltip
          v-else
          :label="filterValues.map((value) => props.filter.displayFn(value)).join(', ')"
        >
          <UIText
            :text="props.filter.itemLabel !== undefined
              ? `${numberFormat.format(filterValues.length)} ${props.filter.itemLabel}`
              : i18n.t('component.filters.selected_count', { count: numberFormat.format(filterValues.length) })"
            class="text-xs text-primary tabular-nums"
          />
        </UIActionTooltip>
      </FiltersActiveBadgeBasePart>
    </FiltersActiveBadgeDropdownMenu>
  </FiltersActiveBadgeBase>
</template>
