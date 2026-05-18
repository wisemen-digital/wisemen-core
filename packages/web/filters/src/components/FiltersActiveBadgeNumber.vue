<script setup lang="ts">
import {
  UIText,
  useNumberFormat,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import FiltersActiveBadgeBase from '@/components/FiltersActiveBadgeBase.vue'
import FiltersActiveBadgeBasePart from '@/components/FiltersActiveBadgeBasePart.vue'
import FiltersActiveBadgeDialogTrigger from '@/components/FiltersActiveBadgeDialogTrigger.vue'
import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import FiltersActiveBadgeValueEmptyState from '@/components/FiltersActiveBadgeValueEmptyState.vue'
import type {
  FilterWithAction,
  NumberFilter,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<NumberFilter>
}>()

const {
  values,
} = useInjectFiltersContext()

const numberFormat = useNumberFormat()

const value = computed<number | null>(() => values.value[props.filter.key] as number | null)

const formattedNumber = computed<string | null>(() => {
  if (value.value === null) {
    return null
  }

  if (props.filter.customUnit !== undefined) {
    return `${numberFormat.format(value.value)} ${props.filter.customUnit}`
  }

  return Intl.NumberFormat(numberFormat.locale.value, props.filter.formatOptions).format(value.value)
})
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon"
      :label="props.filter.label"
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
