<script setup lang="ts">
import {
  UIButton,
  UIText,
} from '@wisemen/vue-core-design-system'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectPreferencesContext } from '#context/preferences.context'

const props = defineProps<{
  hiddenSectionCount: number
}>()

const {
  activeView, onShowView,
} = useInjectPreferencesContext()

const {
  t,
} = useI18n()

function onShowAll(): void {
  onShowView(activeView.value.id)
}
</script>

<template>
  <div class="mt-2xl flex items-center justify-center gap-x-md">
    <UIText
      :text="t('module.preferences.settings_are_hidden.label', {
        count: props.hiddenSectionCount,
        viewName: toValue(activeView.title),
      })"
      class="text-xs text-tertiary"
    />

    <UIButton
      :label="t('module.preferences.settings_are_hidden.show_all.label')"
      variant="secondary"
      size="sm"
      @click="onShowAll"
    />
  </div>
</template>
