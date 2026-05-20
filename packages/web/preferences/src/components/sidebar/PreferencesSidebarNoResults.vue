<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  filteredCategories, searchTerm,
} = useInjectPreferencesContext()

const i18n = useI18n()
</script>

<template>
  <p
    v-if="filteredCategories.length === 0"
    class="px-md text-center text-sm font-medium wrap-break-word text-secondary"
  >
    {{ i18n.t('module.preferences.no_results', { searchTerm }) }}
  </p>
</template>
