<script setup lang="ts">
import { DropdownMenuItem as RekaDropdownMenuItem } from 'reka-ui'
import type { Component } from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import KeyboardShortcut from '@/ui/keyboard-shortcut/KeyboardShortcut.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  disabledReason?: string | null
  icon?: Component
  keyboardShortcut?: string | null
  label: string
}>(), {
  disabledReason: null,
  keyboardShortcut: null,
})

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <UIActionTooltip
    :is-disabled="props.disabledReason === null"
    :label="props.disabledReason"
  >
    <RekaDropdownMenuItem
      :disabled="props.disabledReason !== null"
      class="
        group/dropdown-menu-item cursor-default rounded-sm px-md py-sm
        duration-100 outline-none
        data-disabled:cursor-not-allowed
        not-data-disabled:data-highlighted:bg-secondary-hover
      "
      @select="emit('select')"
    >
      <UIRowLayout justify="between">
        <UIRowLayout>
          <Component
            :is="props.icon"
            v-if="props.icon !== undefined"
            class="
              size-3.5 text-tertiary
              group-data-disabled/dropdown-menu-item:text-disabled
            "
          />

          <UIText
            :text="props.label"
            class="
              flex text-sm text-secondary
              group-data-disabled/dropdown-menu-item:text-disabled
            "
          />
        </UIRowLayout>

        <KeyboardShortcut
          v-if="props.keyboardShortcut !== null"
          :keyboard-shortcut="props.keyboardShortcut"
          class="ml-md"
        />
      </UIRowLayout>
    </RekaDropdownMenuItem>
  </UIActionTooltip>
</template>
