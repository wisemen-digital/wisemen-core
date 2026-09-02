<script setup lang="ts">
import {
  UITabs,
  UITabsItem,
  UITabsList,
} from '@wisemen/vue-core-design-system'
import { toValue } from 'vue'

import PreferencesHeaderCloseButton from '#components/header/PreferencesHeaderCloseButton.vue'
import PreferencesHeaderControls from '#components/header/PreferencesHeaderControls.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  activeTabId, activeView,
} = useInjectPreferencesContext()
</script>

<template>
  <header
    class="
      flex items-center justify-between border-b border-solid border-secondary
      py-md pr-lg pl-3xl
    "
  >
    <div class="flex items-center">
      <PreferencesHeaderControls />
      <h2 class="ml-lg text-sm font-semibold text-primary">
        {{ toValue(activeView.title) }}
      </h2>

      <div
        v-if="activeView.tabs !== undefined && activeView.tabs.length > 0 && activeTabId !== null"
        class="ml-3xl"
      >
        <UITabs
          v-model="activeTabId"
          variant="button-border"
        >
          <UITabsList>
            <UITabsItem
              v-for="tab of activeView.tabs"
              :key="tab.id"
              :value="tab.id"
              :label="toValue(tab.title)"
            />
          </UITabsList>
        </UITabs>
      </div>
    </div>

    <div>
      <PreferencesHeaderCloseButton />
    </div>
  </header>
</template>
