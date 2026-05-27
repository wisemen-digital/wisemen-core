<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const props = defineProps<{
  availableLocales: string[]
}>()

const model = defineModel<string>({
  required: true,
})

const i18n = useI18n()

function getLocaleName(locale: string): string {
  const [
    language,
  ] = locale.split('-')

  const displayNames = new Intl.DisplayNames([
    i18n.locale.value,
  ], {
    type: 'language',
  })

  const region = new Intl.Locale(locale).region

  return `${displayNames.of(language!)}${region ? ` (${region})` : ''}`
}

const options = computed<PreferencesDropdownMenuOption<string>[]>(() => props.availableLocales.map((locale) => ({
  label: getLocaleName(locale),
  value: locale,
})))
</script>

<template>
  <PreferencesSection>
    <PreferencesDropdownMenu
      v-model="model"
      :options="options"
    />
  </PreferencesSection>
</template>
