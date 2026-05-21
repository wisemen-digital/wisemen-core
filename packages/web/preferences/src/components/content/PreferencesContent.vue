<script setup lang="ts">
import { UISeparator } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import PreferencesHiddenSectionsBanner from '#components/content/PreferencesHiddenSectionsBanner.vue'
import PreferencesSectionProvider from '#components/content/PreferencesSectionProvider.vue'
import { useInjectPreferencesContext } from '#context/preferences.context'
import type { PreferencesSection } from '#types/preferences.type'

const {
  activeItem, activeView,
} = useInjectPreferencesContext()

const filteredSections = computed<PreferencesSection[]>(() => {
  if (activeItem.value.type === 'section') {
    return activeView.value.sections.filter((section) => {
      return section.id === activeItem.value.id
    })
  }

  return activeView.value.sections
})

const hiddenSectionCount = computed<number>(() => {
  return activeView.value.sections.length - filteredSections.value.length
})
</script>

<template>
  <div class="h-full overflow-auto pb-2xl">
    <PreferencesSectionProvider
      v-for="section of filteredSections"
      :key="section.id"
      :section="section"
    >
      <Component :is="section.component()" />

      <div
        class="
          px-3xl
          last:hidden
        "
      >
        <UISeparator />
      </div>
    </PreferencesSectionProvider>

    <PreferencesHiddenSectionsBanner
      v-if="hiddenSectionCount > 0"
      :hidden-section-count="hiddenSectionCount"
    />
  </div>
</template>
