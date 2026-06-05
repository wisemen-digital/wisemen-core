<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { UIButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout/index'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { UIText } from '@/ui/text/index'

const i18n = useI18n()
const {
  activeFilterCountIncludingSearch, onClearFiltersAndSearch,
} = useInjectTableContext()
</script>

<template>
  <UIRowLayout
    v-if="activeFilterCountIncludingSearch > 0"
    class="p-xl"
    justify="center"
  >
    <UIText
      :text="i18n.t('component.table.hidden_results_warning.message', { count: activeFilterCountIncludingSearch })"
      class="text-xs text-tertiary"
    />

    <UIButton
      :label="i18n.t('component.table.empty_state.no_results.clear_filters_label')"
      size="sm"
      variant="secondary"
      @click="onClearFiltersAndSearch"
    />
  </UIRowLayout>
</template>
