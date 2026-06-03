<script setup lang="ts">
import { usePreferredContrast } from '@vueuse/core'
import {
  computed,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<boolean>({
  required: true,
})

const i18n = useI18n()
const preferredContrast = usePreferredContrast()

const prefersMoreContrast = computed<boolean>(() => preferredContrast.value === 'more')

watch(prefersMoreContrast, (value) => {
  if (value) {
    model.value = true
  }
}, {
  immediate: true,
})

const stringModel = computed<'false' | 'true'>({
  get: () => model.value ? 'true' : 'false',
  set: (value) => {
    model.value = value === 'true'
  },
})

const options = computed<PreferencesDropdownMenuOption<'false' | 'true'>[]>(() => [
  {
    label: i18n.t('module.preferences.high_contrast.option.enabled'),
    value: 'true',
  },
  {
    label: i18n.t('module.preferences.high_contrast.option.disabled'),
    value: 'false',
  },
])
</script>

<template>
  <PreferencesSection>
    <PreferencesDropdownMenu
      v-model="stringModel"
      :options="options"
      :is-disabled="prefersMoreContrast"
    />
  </PreferencesSection>
</template>
