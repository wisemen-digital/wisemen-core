<script setup lang="ts">
import { DateUtil } from '@wisemen/vue-core-dates'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { DateFormatPreference } from '#sections/date-format/dateFormatPreference.composable'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const model = defineModel<DateFormatPreference>({
  required: true,
})

const i18n = useI18n()

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}

const exampleDate = DateUtil.getNow()

const FORMAT_LOCALES = [
  'en-GB',
  'en-US',
  'de-DE',
  'nl-NL',
  'sv-SE',
  'ja-JP',
] as const satisfies Exclude<DateFormatPreference, 'locale-default'>[]

const options = computed<PreferencesDropdownMenuOption<DateFormatPreference>[]>(() => [
  {
    hint: new Intl.DateTimeFormat(navigator.language, DATE_OPTIONS).format(exampleDate.epochMilliseconds),
    label: i18n.t('module.preferences.date_format.option.default'),
    value: 'locale-default',

  },
  ...FORMAT_LOCALES.map((locale) => ({
    hint: null,
    label: new Intl.DateTimeFormat(locale, DATE_OPTIONS).format(exampleDate.epochMilliseconds),
    value: locale,
  })),
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
