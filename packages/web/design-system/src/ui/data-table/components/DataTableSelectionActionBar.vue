<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'
import type { Action } from '@wisemen/vue-core-actions'
import { XCloseIcon } from '@wisemen/vue-core-icons'
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionTrigger } from '@/ui/action-trigger'
import { UIIconButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'
import { UISeparator } from '@/ui/separator'

const props = defineProps<{
  actions: Action[]
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  selectedCount: number
}>()

const emit = defineEmits<{
  clear: []
}>()

const i18n = useI18n()

useHotkey({
  key: 'Escape',
}, () => {
  if (props.selectedCount > 0) {
    emit('clear')
  }
})
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="props.selectedCount > 0"
      :initial="{
        opacity: 0,
        y: 10,
        scale: 0.99,
      }"
      :animate="{
        opacity: 1,
        y: 0,
        scale: 1,
      }"
      :exit="{
        opacity: 0,
        y: 10,
        scale: 0.99,
      }"
      :transition="{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }"
      class="
        default absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)]
        left-1/2 z-10 flex -translate-x-1/2 items-center justify-between gap-lg
        rounded-xl border border-secondary bg-primary/75 py-sm pr-sm pl-lg
        shadow-lg/5 backdrop-blur-md
      "
    >
      <span
        class="
          pr-2xl text-xs font-medium whitespace-nowrap text-secondary
          tabular-nums
          md:pr-6xl
        "
      >
        {{ i18n.t('component.data_table.selection_action_bar.selected_count', props.selectedCount) }}
      </span>

      <UIRowLayout gap="sm">
        <UIActionTrigger
          v-for="action of props.actions"
          :key="action.id"
          v-slot="{ canExecute, icon, isExecuting, keyboardShortcut, label }"
          :action="action"
          :is-current-context-only="false"
          :models="props.models ?? []"
        >
          <UIIconButton
            v-if="canExecute && icon !== null"
            :label="label"
            :icon="icon"
            :is-loading="isExecuting"
            :keyboard-shortcut="keyboardShortcut"
            variant="tertiary"
            size="sm"
          />
        </UIActionTrigger>

        <UISeparator
          orientation="vertical"
          class="h-4"
        />

        <UIIconButton
          :icon="XCloseIcon"
          :keyboard-shortcut="{
            key: 'Escape',
          }"
          label="Clear selected"
          variant="tertiary"
          size="sm"
          @click="emit('clear')"
        />
      </UIRowLayout>
    </Motion>
  </AnimatePresence>
</template>
