<script setup lang="ts">
import {
  VcSelect,
  VcSelectItem,
} from '@wisemen/vue-core-components'
import { useI18n } from 'vue-i18n'

import { useDefaultPreference } from '@/modules/settings/default-preferences/defaultPreferences'
import SettingsSection from '@/modules/settings/parts/content/SettingsSection.vue'

const {
  availableLocales, locale: activeLocale,
} = useI18n()

const value = useDefaultPreference('language')

function getLocaleName(locale: string): string {
  const [
    language,
  ] = locale.split('-')

  const displayNames = new Intl.DisplayNames([
    activeLocale.value,
  ], {
    type: 'language',
  })

  return displayNames.of(language!) ?? locale
}
</script>

<template>
  <SettingsSection>
    <form>
      <VcSelect
        v-model="value"
        :display-fn="getLocaleName"
        class="max-w-72"
        icon-left="translate"
      >
        <VcSelectItem
          v-for="locale of availableLocales"
          :key="locale"
          :value="locale"
        >
          {{ getLocaleName(locale) }}
        </VcSelectItem>
      </VcSelect>
    </form>
  </SettingsSection>
</template>
