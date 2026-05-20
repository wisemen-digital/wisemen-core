<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

type DisplayZoomValue = 'default' | 'large' | 'small'

const model = defineModel<DisplayZoomValue>({
  required: true,
})

const i18n = useI18n()

const options = computed<PreferencesDropdownMenuOption<DisplayZoomValue>[]>(() => [
  {
    description: i18n.t('module.preferences.display_zoom.option.small.description'),
    label: i18n.t('module.preferences.display_zoom.option.small'),
    value: 'small',
  },
  {
    description: i18n.t('module.preferences.display_zoom.option.default.description'),
    label: i18n.t('module.preferences.display_zoom.option.default'),
    value: 'default',
  },
  {
    description: i18n.t('module.preferences.display_zoom.option.large.description'),
    label: i18n.t('module.preferences.display_zoom.option.large'),
    value: 'large',
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
