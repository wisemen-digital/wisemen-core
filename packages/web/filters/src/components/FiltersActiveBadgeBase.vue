<script setup lang="ts">
import {
  _createUntypedAction,
  GroupPriority,
} from '@wisemen/vue-core-actions'
import {
  _UIActionFocus as UIActionFocus,
  _UIActionTrigger as UIActionTrigger,
  UIIconButton,
  UISeparator,
} from '@wisemen/vue-core-design-system'
import {
  Trash01Icon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import type {
  Filter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<Filter>
}>()

const i18n = useI18n()

const {
  clearFilter,
} = useInjectFiltersContext()

const clearFilterAction = _createUntypedAction({
  id: `clear-filter-${props.filter.key}`,
  name: () => i18n.t('component.filters.remove_filter'),
  execute: () => {
    clearFilter(props.filter.key, false, true)
  },
  group: {
    name: () => props.filter.label,
    category: () => i18n.t('component.filters.action_category'),
    priority: GroupPriority.HOVER,
  },
  icon: () => Trash01Icon,
  keyboardShortcut: {
    key: 'Backspace',
  },
})
</script>

<template>
  <UIActionFocus :actions="[clearFilterAction]">
    <div
      class="
        flex h-6 items-center rounded-sm border border-secondary select-none
      "
    >
      <slot />

      <template v-if="props.filter.isStatic !== true">
        <UISeparator orientation="vertical" />

        <UIActionTrigger
          v-slot="{ keyboardShortcut, label }"
          :action="clearFilterAction"
          :current-context-only="true"
        >
          <UIIconButton
            :icon="XCloseIcon"
            :keyboard-shortcut="keyboardShortcut"
            :label="label"
            size="xs"
            variant="tertiary"
            class="rounded-l-none!"
          />
        </UIActionTrigger>
      </template>
    </div>
  </UIActionFocus>
</template>
