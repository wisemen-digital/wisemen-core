<script setup lang="ts">
import type { NumberFormat } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<NumberFormat>({
  required: true,
})

const i18n = useI18n()

const defaultExample = Intl.NumberFormat(navigator.language, {
  minimumFractionDigits: 2,
}).format(1234.56)

const labels = computed<Record<NumberFormat, string>>(() => ({
  'comma-period': i18n.t('module.preferences.number_format.option.comma_period'),
  'period-comma': i18n.t('module.preferences.number_format.option.period_comma'),
  'space-comma': i18n.t('module.preferences.number_format.option.space_comma'),
  'space-period': i18n.t('module.preferences.number_format.option.space_period'),
  'system': i18n.t('module.preferences.number_format.option.system'),
}))

const values = [
  'system',
  'period-comma',
  'comma-period',
  'space-comma',
  'space-period',
] as const

const options = computed<PreferencesDropdownMenuOption<NumberFormat>[]>(
  () =>
    values.map((value) => ({
      hint: value === 'system' ? defaultExample : null,
      label: labels.value[value],
      value,
    })),
)
</script>

<template>
  <PreferencesSection>
    <PreferencesDropdownMenu
      v-model="model"
      :options="options"
    />
  </PreferencesSection>
</template>
