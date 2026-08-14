<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  DotsVerticalIcon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import { UIActionDropdownMenu } from '@/ui/action-dropdown-menu'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button'
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import type { DataTableCell } from '@/ui/data-table/types/dataTableCell.type'

export interface DataTableMobileCardCell {
  cell: DataTableCell
  headerLabel: string
  key: string
}

const props = withDefaults(defineProps<{
  isExpanded: boolean
  isSelectable?: boolean
  isSelected?: boolean
  hiddenCells: DataTableMobileCardCell[]
  indicatorCell: DataTableCell | null
  inlineActions?: Action[]
  metaCell: DataTableCell | null
  model?: RegisteredActionContext['models'][number] | null
  moreActions?: Action[]
  primaryCell: DataTableCell | null
  secondaryCell: DataTableCell | null
  subComponent?: Component | null
  onClick?: (() => void) | null
}>(), {
  isSelectable: false,
  isSelected: false,
  inlineActions: () => [],
  model: null,
  moreActions: () => [],
  subComponent: null,
  onClick: null,
})

const emit = defineEmits<{
  toggleExpanded: []
  toggleSelected: []
}>()

const i18n = useI18n()

const hasTrailingContent = computed<boolean>(() => props.metaCell !== null || props.indicatorCell !== null)
// subComponent, when provided for a row, is a deliberate curated view that replaces the
// generic unslotted-column dump entirely rather than sitting alongside it.
const visibleHiddenCells = computed<DataTableMobileCardCell[]>(() => (props.subComponent === null ? props.hiddenCells : []))
const canExpand = computed<boolean>(() => props.hiddenCells.length > 0 || props.subComponent !== null)
const allActions = computed<Action[]>(() => props.inlineActions.concat(props.moreActions))
const hasFooter = computed<boolean>(() => props.onClick !== null || allActions.value.length > 0)
</script>

<template>
  <div class="border-b border-secondary">
    <div
      class="flex items-start gap-md px-xl py-lg"
      role="row"
    >
      <BaseCheckbox
        v-if="props.isSelectable"
        :model-value="props.isSelected"
        :is-label-hidden="true"
        :label="i18n.t('component.table.row.toggle_selection_action.name')"
        class="mt-xxs"
        @update:model-value="emit('toggleSelected')"
      />

      <button
        :disabled="!canExpand"
        class="
          flex flex-1 items-start gap-md text-left outline-none
          disabled:cursor-default
        "
        type="button"
        @click="canExpand && emit('toggleExpanded')"
      >
        <div class="min-w-0 flex-1">
          <div
            v-if="props.primaryCell !== null"
            class="truncate text-sm font-semibold text-primary"
          >
            <DataTableCellRenderer :cell="props.primaryCell" />
          </div>

          <div
            v-if="props.secondaryCell !== null"
            class="mt-xxs truncate text-xs text-tertiary"
          >
            <DataTableCellRenderer :cell="props.secondaryCell" />
          </div>
        </div>

        <div
          v-if="hasTrailingContent"
          class="flex shrink-0 flex-col items-end gap-xxs"
        >
          <DataTableCellRenderer
            v-if="props.metaCell !== null"
            :cell="props.metaCell"
            class="text-xs text-tertiary tabular-nums"
          />

          <DataTableCellRenderer
            v-if="props.indicatorCell !== null"
            :cell="props.indicatorCell"
          />
        </div>

        <ChevronDownIcon
          v-if="canExpand"
          :class="{
            '-rotate-90': !props.isExpanded,
          }"
          class="mt-xxs size-3.5 shrink-0 text-disabled duration-150"
        />
      </button>
    </div>

    <div
      v-if="props.isExpanded && canExpand"
      class="flex flex-col gap-lg px-xl pb-lg"
    >
      <div class="divide-y divide-secondary rounded-lg border border-secondary">
        <Component
          :is="props.subComponent"
          v-if="props.subComponent !== null"
          class="p-md"
        />

        <div
          v-for="hiddenCell of visibleHiddenCells"
          :key="hiddenCell.key"
          class="flex items-center justify-between gap-md px-md py-sm"
        >
          <span class="text-xs text-tertiary">
            {{ hiddenCell.headerLabel }}
          </span>

          <DataTableCellRenderer
            :cell="hiddenCell.cell"
            class="text-xs text-primary"
          />
        </div>

        <div
          v-if="hasFooter"
          class="flex items-center gap-xs px-md py-sm"
        >
          <UIButton
            v-if="props.onClick !== null"
            :icon-right="ArrowUpRightIcon"
            :label="i18n.t('component.table.row.view_details_label')"
            size="sm"
            variant="secondary"
            @click="props.onClick"
          />

          <UIActionDropdownMenu
            v-if="allActions.length > 0"
            :actions="allActions"
            :is-current-context-only="true"
            :models="props.model === null ? [] : [props.model]"
            popover-align="start"
            popover-side="bottom"
          >
            <UIIconButton
              :icon="DotsVerticalIcon"
              :is-tooltip-disabled="true"
              :label="i18n.t('component.data_table.row_actions_cell.label')"
              size="sm"
              variant="secondary"
            />
          </UIActionDropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
