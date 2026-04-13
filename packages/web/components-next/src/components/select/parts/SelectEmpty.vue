<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  t,
} = useI18n()

const {
  classConfig,
  customClassConfig,
  filteredItems,
  searchTerm,
  style,
  virtualList,
  virtualListFilteredItems,
} = useInjectSelectContext()

const isEmpty = computed<boolean>(() => {
  if (virtualList.value === null || !virtualList.value.isEnabled) {
    return filteredItems.value.size === 0
  }

  return virtualListFilteredItems.value.length === 0
})
</script>

<template>
  <div
    v-if="isEmpty"
    :class="style.empty({
      class: mergeClasses(customClassConfig.empty, classConfig?.empty),
    })"
  >
    {{ t('component.select.empty_text', { searchTerm }) }}
  </div>
</template>
