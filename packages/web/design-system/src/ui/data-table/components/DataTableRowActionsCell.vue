<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu/index'
import { UIActionTrigger } from '@/ui/action-trigger/index'
import { UIIconButton } from '@/ui/button'

const props = defineProps<{
  inlineActions: Action[]
  model: RegisteredActionContext['models'][number] | null
  moreActions: Action[]
}>()

const i18n = useI18n()
</script>

<template>
  <div
    class="
      sticky right-0 z-2 flex h-10 items-center justify-end gap-xxs border-l
      border-secondary bg-primary px-xl
      not-has-data-[state=open]:group-hover/row:bg-secondary-hover
      group-has-focus-visible/row:bg-tertiary
    "
    role="cell"
    data-row-actions
  >
    <UIActionTrigger
      v-for="action of props.inlineActions"
      :key="action.id"
      :action="action"
      :is-current-context-only="true"
      :models="props.model === null ? [] : [props.model]"
    >
      <template #default="{ canExecute, icon, isExecuting, label }">
        <UIIconButton
          v-if="icon !== null"
          :icon="icon"
          :is-disabled="!canExecute"
          :is-loading="isExecuting"
          :is-tooltip-disabled="false"
          :label="label"
          size="sm"
          variant="tertiary"
          class="pointer-events-auto"
        />
      </template>
    </UIActionTrigger>

    <UIActionDropdownMenu
      v-if="props.moreActions.length > 0"
      :actions="props.moreActions"
      :is-current-context-only="true"
      :models="props.model === null ? [] : [props.model]"
      popover-align="end"
      popover-side="bottom"
    >
      <UIIconButton
        :icon="DotsVerticalIcon"
        :is-tooltip-disabled="true"
        :label="i18n.t('component.data_table.row_actions_cell.label')"
        size="sm"
        variant="tertiary"
        class="pointer-events-auto"
      />
    </UIActionDropdownMenu>
  </div>
</template>
