<script setup lang="ts">
import type { UIToastAutoClose } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<UIToastAutoClose>({
  required: true,
})

const i18n = useI18n()

const options = computed<PreferencesDropdownMenuOption<UIToastAutoClose>[]>(() => [
  {
    description: i18n.t('module.preferences.toast_auto_close.option.always.description'),
    label: i18n.t('module.preferences.toast_auto_close.option.always'),
    value: 'always',
  },
  {
    description: i18n.t('module.preferences.toast_auto_close.option.all_except_errors.description'),
    label: i18n.t('module.preferences.toast_auto_close.option.all_except_errors'),
    value: 'all-except-errors',
  },
  {
    description: i18n.t('module.preferences.toast_auto_close.option.never.description'),
    label: i18n.t('module.preferences.toast_auto_close.option.never'),
    value: 'never',
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
