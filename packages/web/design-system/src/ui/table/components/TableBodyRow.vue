<script setup lang="ts">
import { createAction } from '@wisemen/vue-core-actions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

import type { RegisteredActionContext } from '@/register'
import { UIActionContextMenu } from '@/ui/action-context-menu/index'
import { UIActionFocus } from '@/ui/action-focus/index'
import TableBodyRowActionsCell from '@/ui/table/components/TableBodyRowActionsCell.vue'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { useInjectTableContext } from '@/ui/table/context/table.context'
import { useProvideTableBodyRowContext } from '@/ui/table/context/tableBodyRow.context'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'

const props = withDefaults(defineProps<{
  actionModel?: RegisteredActionContext['models'][number] | null
  ariaLabel?: string | null
  itemKey?: string | null
  link?: RouteLocationRaw | null
}>(), {
  actionModel: null,
  ariaLabel: null,
  itemKey: null,
  link: null,
})

const i18n = useI18n()

const {
  isGroupingEnabled, actions,
} = useInjectTableContext()

const {
  isSelectable, toggleItem,
} = useInjectTableSelectionContext()

const toggleSelectionAction = createAction({
  id: 'table-row-toggle-selection',
  isApplicable: (ctx) => isSelectable.value
    && props.itemKey !== null
    && ctx.menuType === undefined,
  name: () => i18n.t('component.table.row.toggle_selection_action.name'),
  execute: () => {
    if (props.itemKey != null) {
      toggleItem(props.itemKey)
    }
  },
  keyboardShortcut: {
    key: 'X',
  },
})

useProvideTableBodyRowContext({
  link: computed(() => props.link),
})
</script>

<template>
  <UIActionContextMenu
    :actions="actions"
    :current-context-only="true"
    :models="props.actionModel === null ? [] : [props.actionModel]"
  >
    <UIActionFocus
      :actions="[...actions, toggleSelectionAction]"
      :models="props.actionModel === null ? [] : [props.actionModel]"
    >
      <TableSubgrid
        :class="{
          'border-b border-secondary has-[[data-row-actions]_[data-state=open]]:border-secondary/25 data-[state=open]:border-secondary/25': !isGroupingEnabled,
        }"
        class="
          group/row relative isolate transition-[filter,opacity] duration-150
          group-has-[[data-context-menu-trigger][data-state=open]]/body:opacity-25
          group-has-[[data-row-actions]_[data-state=open]]/body:opacity-25
          not-has-[[data-row-actions]_[data-state=open]]:hover:bg-secondary
          has-focus-visible:bg-tertiary
          has-[[data-row-actions]_[data-state=open]]:opacity-100
          data-[state=open]:opacity-100!
        "
      >
        <!--
          Row-level link: keyboard tab stop and screen reader anchor.
          pointer-events-none so it never intercepts mouse clicks (per-cell links handle those).
          Must be first in DOM so it's first in tab order.
        -->
        <RouterLink
          v-if="link !== null"
          :to="link"
          :aria-label="ariaLabel ?? i18n.t('component.table.row.view_details_label')"
          class="pointer-events-none absolute inset-0 z-0 outline-none"
        />

        <slot />

        <TableBodyRowActionsCell
          v-if="actions.length > 0"
          :action-model="props.actionModel"
        />
      </TableSubgrid>
    </UIActionFocus>
  </UIActionContextMenu>
</template>
