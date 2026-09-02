<script setup lang="ts">
import {
  UIRowLayout,
  UISeparator,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import FiltersActiveAddFilters from '@/components/FiltersActiveAddFilters.vue'
import FiltersActiveBadge from '@/components/FiltersActiveBadge.vue'
import type {
  Filter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const {
  activeFilters,
} = useInjectFiltersContext()

const persistentFilters = computed<FilterWithAction<Filter>[]>(
  () => activeFilters.value.filter((f) => f.isPersistent === true),
)

const nonPersistentFilters = computed<FilterWithAction<Filter>[]>(
  () => activeFilters.value.filter((f) => f.isPersistent !== true),
)
</script>

<template>
  <UIRowLayout gap="xs">
    <FiltersActiveBadge
      v-for="filter of persistentFilters"
      :key="filter.key"
      :filter="filter"
    />

    <UISeparator
      v-if="persistentFilters.length > 0 && nonPersistentFilters.length > 0"
      orientation="vertical"
      class="mx-sm h-4"
    />

    <FiltersActiveBadge
      v-for="filter of nonPersistentFilters"
      :key="filter.key"
      :filter="filter"
    />

    <FiltersActiveAddFilters v-if="activeFilters.length > 0" />
  </UIRowLayout>
</template>
