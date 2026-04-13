<script setup lang="ts">
import {
  VcRadioGroup,
  VcThemeProvider,
} from '@wisemen/vue-core-components'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

import SettingsAppearanceMiniDashboard from '@/modules/settings/default-preferences/appearance/SettingsAppearanceMiniDashboard.vue'
import SettingsAppearanceRadioGroupItem from '@/modules/settings/default-preferences/appearance/SettingsAppearanceRadioGroupItem.vue'
import { useDefaultPreference } from '@/modules/settings/default-preferences/defaultPreferences'
import SettingsSection from '@/modules/settings/parts/content/SettingsSection.vue'

const {
  t,
} = useI18n()
const value = useDefaultPreference('appearance')

const id = useId()
</script>

<template>
  <SettingsSection :is-single-column-layout="true">
    <form>
      <label
        :for="id"
        class="sr-only"
      >
        {{ t('module.settings.section.appearance.title') }}
      </label>

      <VcRadioGroup
        :id="id"
        v-model="value"
      >
        <div
          class="
            grid gap-xl
            @lg/settings:grid-cols-3
          "
        >
          <SettingsAppearanceRadioGroupItem
            :label="t('module.settings.section.appearance.option.light_mode')"
            value="light"
          >
            <VcThemeProvider
              appearance="light"
              class="relative h-30 bg-secondary"
            >
              <SettingsAppearanceMiniDashboard
                class="absolute top-1/6 left-1/10"
              />
            </VcThemeProvider>
          </SettingsAppearanceRadioGroupItem>

          <SettingsAppearanceRadioGroupItem
            :label="t('module.settings.section.appearance.option.dark_mode')"
            value="dark"
          >
            <VcThemeProvider
              appearance="dark"
              class="relative h-30 bg-secondary"
            >
              <SettingsAppearanceMiniDashboard
                class="absolute top-1/6 left-1/10"
              />
            </VcThemeProvider>
          </SettingsAppearanceRadioGroupItem>

          <SettingsAppearanceRadioGroupItem
            :label="t('module.settings.section.appearance.option.system_preference')"
            value="system"
          >
            <VcThemeProvider
              appearance="light"
              class="relative z-2 h-full w-1/2 overflow-clip"
            >
              <div class="relative h-full overflow-hidden bg-secondary">
                <SettingsAppearanceMiniDashboard
                  class="absolute top-1/6 left-1/5"
                />
              </div>
            </VcThemeProvider>

            <VcThemeProvider
              appearance="dark"
              class="absolute inset-0 h-full"
            >
              <div
                class="
                  relative h-full overflow-hidden rounded-l-xl bg-secondary
                "
              >
                <SettingsAppearanceMiniDashboard
                  class="absolute top-1/6 left-1/10"
                />
              </div>
            </VcThemeProvider>

            <label class="mt-md inline-block text-sm font-medium text-primary">
              System preferences
            </label>
          </SettingsAppearanceRadioGroupItem>
        </div>
      </VcRadioGroup>
    </form>
  </SettingsSection>
</template>
