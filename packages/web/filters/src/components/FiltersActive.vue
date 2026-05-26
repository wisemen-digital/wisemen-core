<script setup lang="ts">
import { UIRowLayout } from '@wisemen/vue-core-design-system'

import FiltersActiveAddFilters from '@/components/FiltersActiveAddFilters.vue'
import FiltersActiveBadge from '@/components/FiltersActiveBadge.vue'
import { useInjectFiltersContext } from '@/context/filters.context'

const {
  activeFilters,
} = useInjectFiltersContext()
</script>

<template>
  <UIRowLayout
    gap="xs"
  >
    <FiltersActiveBadge
      v-for="activeFilter of activeFilters"
      :key="activeFilter.key"
      :filter="activeFilter"
    />

    <FiltersActiveAddFilters v-if="activeFilters.length > 0" />
  </UIRowLayout>
</template>
