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
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  FilterWithAction,
  MultiAutocompleteFilter,
  MultiSelectFilter,
  SelectFilterValue,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<MultiAutocompleteFilter> | FilterWithAction<MultiSelectFilter>
}>()

const i18n = useI18n()

const {
  values,
} = useInjectFiltersContext()

const filterValues = computed<SelectFilterValue[]>(() => values.value[props.filter.key] as SelectFilterValue[])

const numberFormat = useNumberFormat()
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon"
      :label="props.filter.label"
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
            :text="i18n.t('component.filters.selected_count', {
              count: numberFormat.format(filterValues.length),
            })"
            class="text-xs text-primary tabular-nums"
          />
        </UIActionTooltip>
      </FiltersActiveBadgeBasePart>
    </FiltersActiveBadgeDropdownMenu>
  </FiltersActiveBadgeBase>
</template>
