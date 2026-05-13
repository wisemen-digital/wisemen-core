<script setup lang="ts">
import { SearchLgIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useCommandMenuAction } from '@/actions/commandMenu.action'
import ActionTrigger from '@/ui/action-trigger/ActionTrigger.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import KeyboardShortcut from '@/ui/keyboard-shortcut/KeyboardShortcut.vue'

const i18n = useI18n()
const commandMenuAction = useCommandMenuAction()
</script>

<template>
  <ActionTrigger
    v-slot="{ keyboardShortcut }"
    :action="commandMenuAction"
    :current-context-only="true"
  >
    <ClickableElement>
      <button
        type="button"
        class="
          flex h-6.5 w-full max-w-60 cursor-pointer items-center gap-sm
          rounded-md bg-fg-primary/5 pr-sm pl-md duration-100
          hover:bg-fg-primary/7 hover:brightness-98
          dark:bg-primary/90
          dark:hover:bg-primary/90 dark:hover:brightness-105
        "
      >
        <SearchLgIcon class="size-3.5 shrink-0 text-quaternary" />

        <span class="flex-1 truncate text-left text-xs text-placeholder">
          {{ i18n.t('component.top_bar.search') }}
        </span>

        <KeyboardShortcut
          v-if="keyboardShortcut !== null"
          :keyboard-shortcut="keyboardShortcut"
          :enable-key-hold-visualization="true"
        />
      </button>
    </ClickableElement>
  </ActionTrigger>
</template>
