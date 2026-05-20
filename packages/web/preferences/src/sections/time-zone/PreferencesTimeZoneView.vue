<script setup lang="ts">
import { TimeZoneUtil } from '@wisemen/vue-core-dates'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import PreferencesDropdownMenu from '#components/PreferencesDropdownMenu.vue'
import type { PreferencesDropdownMenuOption } from '#types/preferencesDropdownMenuOption.type'

const props = defineProps<{
  availableTimeZones: string[]
}>()

const model = defineModel<string>({
  required: true,
})

const i18n = useI18n()

const options = computed<PreferencesDropdownMenuOption<string>[]>(() =>
  props.availableTimeZones.map((timeZone) => ({
    label: TimeZoneUtil.getTimeZoneLabel(timeZone, i18n.locale.value),
    value: timeZone,
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
