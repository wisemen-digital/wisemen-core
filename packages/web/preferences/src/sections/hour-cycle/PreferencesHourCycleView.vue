<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { TimeUtil } from '@wisemen/vue-core-dates'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { HourCyclePreference } from '#sections/hour-cycle/hourCyclePreference.composable'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<HourCyclePreference>({
  required: true,
})

const i18n = useI18n()
const now = useNow({
  interval: 1000,
})

const options = computed<PreferencesDropdownMenuOption<HourCyclePreference>[]>(() => [
  {
    hint: new Intl.DateTimeFormat(i18n.locale.value, {
      hour: '2-digit',
      hour12: TimeUtil.getDefaultHourCycleForLocale(i18n.locale.value) === '12-hour',
      minute: '2-digit',
    }).format(now.value),
    label: i18n.t('module.preferences.time_format.option.default'),
    value: 'locale-default',
  },
  {
    hint: new Intl.DateTimeFormat(i18n.locale.value, {
      hour: '2-digit',
      hour12: true,
      minute: '2-digit',
    }).format(now.value),
    label: i18n.t('module.preferences.time_format.option.twelve_hour'),
    value: '12-hour',
  },
  {
    hint: new Intl.DateTimeFormat(i18n.locale.value, {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
    }).format(now.value),
    label: i18n.t('module.preferences.time_format.option.twenty_four_hour'),
    value: '24-hour',
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
