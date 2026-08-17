<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionContextMenu } from '@/ui/action-context-menu/index'
import { UIActionFocus } from '@/ui/action-focus/index'
import DataTableRowActionsCell from '@/ui/data-table/components/DataTableRowActionsCell.vue'

const props = withDefaults(defineProps<{
  hasRowActions?: boolean
  isLast?: boolean
  focusOnlyActions?: Action[]
  inlineActions?: Action[]
  model?: RegisteredActionContext['models'][number] | null
  moreActions?: Action[]
  onRowClick?: (() => void) | null
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
      :actions="props.focusOnlyActions"
      :models="props.model === null ? [] : [props.model]"
    >
      <div
        :class="{
          'border-b border-secondary': !props.isLast,
        }"
        class="
          group/row relative col-span-full grid grid-cols-subgrid bg-primary
          hover:bg-secondary-hover
          has-focus-visible:bg-tertiary
        "
        role="row"
      >
        <!-- Row-level keyboard tab stop — mouse clicks go through DataTableCell's own catchers. -->
        <button
          v-if="props.onRowClick !== null"
          :aria-label="i18n.t('component.table.row.view_details_label')"
          class="pointer-events-none absolute inset-0 z-0 outline-none"
          type="button"
          @click="props.onRowClick"
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
