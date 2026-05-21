<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { NavigationArrowsPreference } from '#sections/navigation-arrows/navigationArrowsPreference.composable'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<NavigationArrowsPreference>({
  required: true,
})

const i18n = useI18n()

const options = computed<PreferencesDropdownMenuOption<NavigationArrowsPreference>[]>(() => [
  {
    label: i18n.t('module.preferences.navigation_arrows.option.show'),
    value: 'show',
  },
  {
    label: i18n.t('module.preferences.navigation_arrows.option.hide'),
    value: 'hide',
  },
])
</script>

<template>
  <PreferencesSection>
    <PreferencesDropdownMenu
      v-model="model"
      :options="options"
    />
  </PreferencesSection>
</template>
