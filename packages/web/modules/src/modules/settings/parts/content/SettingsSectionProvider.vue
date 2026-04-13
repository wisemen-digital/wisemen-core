<script setup lang="ts">
import { computed } from 'vue'

import type { SettingsSection } from '@/modules/settings/settings.type'
import { useProvideSettingsSectionContext } from '@/modules/settings/settingsSection.context'

const props = defineProps<{
  section: SettingsSection
}>()

useProvideSettingsSectionContext({
  section: computed<SettingsSection>(() => props.section),
})
</script>

<template>
  <slot />
</template>
