<script setup lang="ts">
import {
  VcButton,
  VcKeyboardShortcut,
  VcKeyboardShortcutProvider,
} from '@wisemen/vue-core-components'
import { useI18n } from 'vue-i18n'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const props = defineProps<{
  hiddenSectionCount: number
}>()

const {
  activeView, onShowView,
} = useInjectSettingsContext()

const {
  t,
} = useI18n()

function onShowAll(): void {
  onShowView(activeView.value.id)
}
</script>

<template>
  <div class="mt-2xl flex items-center justify-center gap-x-md">
    <p class="text-xs text-tertiary">
      {{ t('module.settings.settings_are_hidden.label', { count: props.hiddenSectionCount,
                                                          viewName: activeView.title }) }}
    </p>

    <VcKeyboardShortcutProvider :keyboard-keys="['a']">
      <VcButton
        :class-config="{
          root: 'h-6 text-xs px-sm font-regular',
        }"
        variant="secondary"
        size="sm"
        @click="onShowAll"
      >
        {{ t('module.settings.settings_are_hidden.show_all.label') }}

        <VcKeyboardShortcut
          :keyboard-keys="['a']"
          :class-config="{
            keyboardKey: {
              key: 'shadow-none bg-tertiary h-3.5 min-w-3.5 group-hover/button:bg-quaternary duration-200',
            },
          }"
          class="ml-sm"
        />
      </VcButton>
    </VcKeyboardShortcutProvider>
  </div>
</template>
