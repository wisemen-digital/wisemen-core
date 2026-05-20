<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'
import {
  UIActionDropdownMenu,
  UIButton,
} from '@wisemen/vue-core-design-system'
import { FilterLinesIcon } from '@wisemen/vue-core-icons'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectFiltersContext } from '@/context/filters.context'

const i18n = useI18n()

const {
  action,
} = useInjectFiltersContext()

const isOpen = ref<boolean>(false)

useHotkey('F', () => {
  isOpen.value = true
})
</script>

<template>
  <UIActionDropdownMenu
    v-model:is-open="isOpen"
    :parent-action="action"
    :popover-collision-padding="10"
    :current-context-only="false"
    popover-align="start"
    popover-side="bottom"
  >
    <UIButton
      :keyboard-shortcut="{
        key: 'F',
      }"
      :icon-left="FilterLinesIcon"
      :label="i18n.t('component.filters_dropdown_menu.filter')"
      :tooltip-label="i18n.t('component.filters_dropdown_menu.add_filter')"
      variant="secondary"
    />
  </UIActionDropdownMenu>
</template>
