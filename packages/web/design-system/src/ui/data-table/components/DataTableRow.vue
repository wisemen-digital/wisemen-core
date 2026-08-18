<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionContextMenu } from '@/ui/action-context-menu/index'
import { UIActionFocus } from '@/ui/action-focus/index'
import DataTableRowActionsCell from '@/ui/data-table/components/DataTableRowActionsCell.vue'
import DataTableRowClickCatcher from '@/ui/data-table/components/DataTableRowClickCatcher.vue'
import type { DataTableRowClick } from '@/ui/data-table/types/dataTableRowConfig.type'

const props = withDefaults(defineProps<{
  hasRowActions?: boolean
  isLast?: boolean
  focusOnlyActions?: Action[]
  inlineActions?: Action[]
  model?: RegisteredActionContext['models'][number] | null
  moreActions?: Action[]
  onRowClick?: DataTableRowClick | null
}>(), {
  hasRowActions: false,
  isLast: false,
  focusOnlyActions: () => [],
  inlineActions: () => [],
  model: null,
  moreActions: () => [],
  onRowClick: null,
})

const i18n = useI18n()

const allActions = computed<Action[]>(() => props.inlineActions.concat(props.moreActions))
</script>

<template>
  <UIActionContextMenu
    :actions="allActions"
    :is-current-context-only="true"
    :models="props.model === null ? [] : [props.model]"
  >
    <UIActionFocus
      :actions="[...props.focusOnlyActions, ...allActions]"
      :models="props.model === null ? [] : [props.model]"
    >
      <div
        :class="{
          'border-b border-secondary has-[[data-row-actions]_[data-state=open]]:border-secondary/25 data-[state=open]:border-secondary/25': !props.isLast,
        }"
        class="
          group/row relative col-span-full grid grid-cols-subgrid bg-primary
          transition-[filter,opacity] duration-150
          group-has-[[data-context-menu-trigger][data-state=open]]/body:opacity-25
          group-has-[[data-row-actions]_[data-state=open]]/body:opacity-25
          has-[[data-row-actions]_[data-state=open]]:opacity-100
          data-[state=open]:opacity-100!
        "
        role="row"
      >
        <!-- Row-level keyboard tab stop — mouse clicks go through DataTableCell's own catchers. -->
        <DataTableRowClickCatcher
          :is-row-level="true"
          :aria-label="i18n.t('component.table.row.view_details_label')"
          :click="props.onRowClick"
          :model="props.model"
        />

        <slot />

        <DataTableRowActionsCell
          v-if="props.hasRowActions"
          :inline-actions="props.inlineActions"
          :model="props.model"
          :more-actions="props.moreActions"
        />
      </div>
    </UIActionFocus>
  </UIActionContextMenu>
</template>
