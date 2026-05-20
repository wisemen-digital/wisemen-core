<script setup lang="ts">
import { computed } from 'vue'

import { useProvidePreferencesSectionContext } from '#context/preferencesSection.context'
import type { PreferencesSection } from '#types/preferences.type'

const props = defineProps<{
  section: PreferencesSection
}>()

useProvidePreferencesSectionContext({
  section: computed<PreferencesSection>(() => props.section),
})
</script>

<template>
  <slot />
</template>
