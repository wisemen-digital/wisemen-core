<script setup lang="ts">
import { VcSwitch } from '@wisemen/vue-core-components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDefaultPreference } from '@/modules/settings/default-preferences/defaultPreferences'
import SettingsSection from '@/modules/settings/parts/content/SettingsSection.vue'

const {
  t,
} = useI18n()
const value = useDefaultPreference('enableHighContrast')

const label = computed<string>(() => {
  if (value.value) {
    return t('module.settings.enabled')
  }

  return t('module.settings.disabled')
})

const hint = computed<string>(() => {
  if (value.value) {
    return t('module.settings.section.high_contrast.enabled.label')
  }

  return t('module.settings.section.high_contrast.disabled.label')
})
</script>

<template>
  <SettingsSection>
    <VcSwitch
      v-model="value"
      :label="label"
      :hint="hint"
    />
  </SettingsSection>
</template>
