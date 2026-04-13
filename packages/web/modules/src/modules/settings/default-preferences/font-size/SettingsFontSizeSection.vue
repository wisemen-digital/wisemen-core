<script setup lang="ts">
import {
  VcSelect,
  VcSelectItem,
} from '@wisemen/vue-core-components'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDefaultPreference } from '@/modules/settings/default-preferences/defaultPreferences'
import SettingsSection from '@/modules/settings/parts/content/SettingsSection.vue'

const {
  t,
} = useI18n()
const id = useId()

const options = [
  'smaller',
  'small',
  'default',
  'large',
  'larger',
] as const

const value = useDefaultPreference('fontSize')
</script>

<template>
  <SettingsSection>
    <form>
      <label
        :for="id"
        class="sr-only"
      >
        {{ t('module.settings.section.font_size.title') }}
      </label>

      <VcSelect
        :id="id"
        v-model="value"
        :display-fn="(v) => t(`module.settings.section.font_size.option.${v}`)"
        icon-left="fontSize"
        class="max-w-72"
      >
        <VcSelectItem
          v-for="option in options"
          :key="option"
          :value="option"
        >
          {{ t(`module.settings.section.font_size.option.${option}`) }}
        </VcSelectItem>
      </VcSelect>
    </form>
  </SettingsSection>
</template>
