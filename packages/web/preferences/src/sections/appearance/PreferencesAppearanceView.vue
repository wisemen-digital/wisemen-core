<script setup lang="ts">
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
import { useI18n } from 'vue-i18n'

import PreferencesSection from '#components/content/PreferencesSection.vue'
import type { AppearancePreference } from '#sections/appearance/appearancePreference.composable'
import PreferencesAppearanceMiniDashboard from '#sections/appearance/PreferencesAppearanceMiniDashboard.vue'
import PreferencesAppearanceRadioGroupItem from '#sections/appearance/PreferencesAppearanceRadioGroupItem.vue'

const model = defineModel<AppearancePreference>({
  required: true,
})
const i18n = useI18n()
</script>

<template>
  <PreferencesSection :is-single-column-layout="true">
    <div
      class="
        grid w-full gap-xl
        @2xl/preferences:grid-cols-3
      "
    >
      <PreferencesAppearanceRadioGroupItem
        v-model="model"
        :label="i18n.t('module.preferences.appearance.option.light_mode')"
        value="light"
      >
        <UIThemeProvider
          appearance="light"
          class="relative h-30 bg-secondary"
        >
          <PreferencesAppearanceMiniDashboard
            class="absolute top-1/6 left-1/10"
          />
        </UIThemeProvider>
      </PreferencesAppearanceRadioGroupItem>

      <PreferencesAppearanceRadioGroupItem
        v-model="model"
        :label="i18n.t('module.preferences.appearance.option.dark_mode')"
        value="dark"
      >
        <UIThemeProvider
          appearance="dark"
          class="relative h-30 bg-secondary"
        >
          <PreferencesAppearanceMiniDashboard
            class="absolute top-1/6 left-1/10"
          />
        </UIThemeProvider>
      </PreferencesAppearanceRadioGroupItem>

      <PreferencesAppearanceRadioGroupItem
        v-model="model"
        :label="i18n.t('module.preferences.appearance.option.system_preference')"
        value="system"
      >
        <UIThemeProvider
          appearance="light"
          class="relative z-2 h-full w-1/2 overflow-clip"
        >
          <div class="relative h-full overflow-hidden bg-secondary">
            <PreferencesAppearanceMiniDashboard
              class="absolute top-1/6 left-1/5"
            />
          </div>
        </UIThemeProvider>

        <UIThemeProvider
          appearance="dark"
          class="absolute inset-0 h-full"
        >
          <div
            class="relative h-full overflow-hidden rounded-l-xl bg-secondary"
          >
            <PreferencesAppearanceMiniDashboard
              class="absolute top-1/6 left-1/10"
            />
          </div>
        </UIThemeProvider>

        <label class="mt-md inline-block text-sm font-medium text-primary">
          {{ i18n.t('module.preferences.appearance.option.system_preference') }}
        </label>
      </PreferencesAppearanceRadioGroupItem>
    </div>
  </PreferencesSection>
</template>
