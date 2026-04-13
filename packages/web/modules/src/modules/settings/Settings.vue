<script setup lang="ts" generic="TConfig extends SettingsConfig">
import type { DefaultPreferences } from '@/modules/settings/default-preferences/defaultPreferences'
import SettingsContent from '@/modules/settings/parts/content/SettingsContent.vue'
import SettingsHeader from '@/modules/settings/parts/header/SettingsHeader.vue'
import SettingsRoot from '@/modules/settings/parts/SettingsRoot.vue'
import SettingsSidebar from '@/modules/settings/parts/sidebar/SettingsSidebar.vue'
import SettingsSidebarContent from '@/modules/settings/parts/sidebar/SettingsSidebarContent.vue'
import SettingsSidebarSearchInput from '@/modules/settings/parts/sidebar/SettingsSidebarSearchInput.vue'
import type { SettingsProps } from '@/modules/settings/settings.props'
import type {
  SettingsConfig,
  ViewIdFromConfig,
} from '@/modules/settings/settings.type'

const props = defineProps<SettingsProps<TConfig>>()

const emit = defineEmits<{
  'update:activeView': [viewId: ViewIdFromConfig<SettingsConfig>]
}>()

const defaultPreferences = defineModel<DefaultPreferences>('defaultPreferences', {
  required: true,
})
</script>

<template>
  <SettingsRoot
    v-bind="props"
    v-model:default-preferences="defaultPreferences"
    @update:active-view="emit('update:activeView', $event)"
  >
    <SettingsSidebar>
      <SettingsSidebarSearchInput />
      <SettingsSidebarContent />
    </SettingsSidebar>

    <div class="flex w-full flex-col overflow-hidden bg-primary">
      <SettingsHeader>
        <template #header-right>
          <slot name="header-right" />
        </template>
      </SettingsHeader>

      <SettingsContent />
    </div>
  </SettingsRoot>
</template>
