<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<boolean>({
  required: true,
})

const i18n = useI18n()

const stringModel = computed<'false' | 'true'>({
  get: () => model.value ? 'true' : 'false',
  set: (value) => {
    model.value = value === 'true'
  },
})

const options = computed<PreferencesDropdownMenuOption<'false' | 'true'>[]>(() => [
  {
    label: i18n.t('module.preferences.navigation_arrows.option.show'),
    value: 'true',
  },
  {
    label: i18n.t('module.preferences.navigation_arrows.option.hide'),
    value: 'false',
  },
])
</script>

<template>
  <PreferencesSection>
    <PreferencesDropdownMenu
      v-model="stringModel"
      :options="options"
    />
  </PreferencesSection>
</template>
