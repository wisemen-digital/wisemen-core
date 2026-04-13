<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import Button from '@/components/button/default-button/Button.vue'
import { useInjectTableContext } from '@/components/table/table.context'

const props = defineProps<{
  isEmpty: boolean
  isLoading: boolean
  activeFilterCount: number
  onClear: () => void
}>()

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTableContext()

const {
  t,
} = useI18n()
</script>

<template>
  <div
    v-if="props.activeFilterCount > 0 && !props.isLoading && !props.isEmpty"
    :class="style.hiddenResultsHint({
      class: mergeClasses(customClassConfig?.hiddenResultsHint, classConfig?.hiddenResultsHint),
    })"
  >
    <span class="text-xs text-tertiary">
      {{
        t('component.table.results_may_be_hidden', {
          count: props.activeFilterCount,
        })
      }}
    </span>

    <Button
      :class-config="{
        root: 'h-6 px-sm font-regular',
        content: 'text-xs',
      }"
      size="sm"
      variant="secondary"
      @click="props.onClear()"
    >
      {{
        t('component.table.clear_filter', {
          count: props.activeFilterCount,
        })
      }}
    </Button>
  </div>
</template>
