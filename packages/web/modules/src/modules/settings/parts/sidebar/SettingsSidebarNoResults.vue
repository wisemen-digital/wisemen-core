<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const {
  filteredCategories, searchTerm,
} = useInjectSettingsContext()

const {
  t,
} = useI18n()
</script>

<template>
  <p
    v-if="filteredCategories.length === 0"
    class="text-sm wrap-break-word text-tertiary"
  >
    {{ t('module.settings.no_results', { searchTerm }) }}
  </p>
</template>
