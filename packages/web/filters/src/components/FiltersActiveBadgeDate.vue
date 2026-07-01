<script setup lang="ts">
import type { PlainDate } from '@wisemen/vue-core-dates'
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
  DateFilter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<DateFilter>
}>()

const {
  values,
} = useInjectFiltersContext()

const dateTimeFormat = useDateTimeFormat()

const value = computed<PlainDate | null>(() => values.value[props.filter.key] as PlainDate | null)
</script>

<template>
  <FiltersActiveBadgeBase :filter="props.filter">
    <FiltersActiveBadgeBasePart
      :icon="props.filter.icon ?? null"
      :label="props.filter.label"
    />

    <FiltersActiveBadgePartSeparator />

    <template v-if="props.filter.isPersistent ?? false">
      <FiltersActiveBadgeDateNavigation
        :filter-id="props.filter.key"
        :from="value"
        :until="value"
        @navigate="(from) => (values.value as any)[props.filter.key] = from"
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
