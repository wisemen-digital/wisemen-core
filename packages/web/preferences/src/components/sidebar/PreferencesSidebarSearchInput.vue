<script setup lang="ts">
import { ListboxFilter } from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  searchTerm,
} = useInjectPreferencesContext()

const i18n = useI18n()
</script>

<template>
  <ListboxFilter
    v-model="searchTerm"
    :placeholder="i18n.t('module.preferences.search.placeholder')"
    :aria-label="i18n.t('module.preferences.search.label')"
    class="
      h-8 rounded-md border border-secondary bg-primary px-md text-xs
      text-primary outline-none
      hover:border-primary
      focus:border-primary
    "
  />
</template>
