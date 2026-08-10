<script setup lang="ts" generic="TItem">
import type {
  Header,
  Row,
} from '@tanstack/vue-table'
import type { Component } from 'vue'
import {
  computed,
  shallowRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import DataTableDataRow from '@/ui/data-table/components/DataTableDataRow.vue'
import DataTableGroupRow from '@/ui/data-table/components/DataTableGroupRow.vue'
import DataTableHeaderCell from '@/ui/data-table/components/DataTableHeaderCell.vue'
import DataTableHeaderCheckboxCell from '@/ui/data-table/components/DataTableHeaderCheckboxCell.vue'
import DataTableMobileList from '@/ui/data-table/components/DataTableMobileList.vue'
import DataTableSelectionActionBar from '@/ui/data-table/components/DataTableSelectionActionBar.vue'
import DataTableVirtualRows from '@/ui/data-table/components/DataTableVirtualRows.vue'
import { useDataTable } from '@/ui/data-table/composables/dataTable.composable'
import { useDataTableGroupedVirtualScroller } from '@/ui/data-table/composables/dataTableGroupedVirtualScroller.composable'
import { useDataTableVirtualScroller } from '@/ui/data-table/composables/dataTableVirtualScroller.composable'
import { useProvideDataTableContext } from '@/ui/data-table/context/dataTable.context'
import type { DataTableProps } from '@/ui/data-table/types/dataTable.props'
import type { DataTableCell as DataTableCellDefinition } from '@/ui/data-table/types/dataTableCell.type'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'
import { useTableSelection } from '@/ui/table/composables/tableSelection.composable'
import type { TableSelectionState } from '@/ui/table/types/table.type'

const props = withDefaults(defineProps<DataTableProps<TItem>>(), {
  isColumnResizeDisabled: false,
  isFirstColumnSticky: true,
  isLastColumnSticky: false,
  isSelectable: false,
  getActionModel: null,
  groupBy: null,
  mobileCard: null,
  selectionActions: () => [],
  sort: null,
  subComponent: null,
})

const emit = defineEmits<{
  select: [state: TableSelectionState<TItem>]
}>()

const i18n = useI18n()

const scrollContainerEl = shallowRef<HTMLElement | null>(null)

// Computed directly from `props.data`, independent of TanStack's row model, so `hasSubComponent`
// (needed by `useDataTable` for the grid template, below) has no circular dependency on `table`.
const subComponentByItemKey = computed<Map<string, Component>>(() => {
  const map = new Map<string, Component>()

  if (props.subComponent === null) {
    return map
  }

  for (const item of props.data) {
    const subComponent = props.subComponent(item)

    if (subComponent !== null) {
      map.set(props.getKey(item), subComponent)
    }
  }

  return map
})

// A row's own `subComponent(item)` return value (not just whether the prop function is set)
// determines whether the expand column exists at all — a consumer whose function always
// returns `null` (e.g. gated by some other condition) should not see a reserved, empty column.
const hasSubComponent = computed<boolean>(() => subComponentByItemKey.value.size > 0)

const {
  gridTemplateColumns,
  isLeadingStickyRegionActive,
  leadingStickyOffsetsPx,
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  setColumnSize,
  table,
} = useDataTable({
  hasSubComponent,
  isColumnResizeDisabled: computed(() => props.isColumnResizeDisabled),
  isFirstColumnSticky: computed(() => props.isFirstColumnSticky),
  isLastColumnSticky: computed(() => props.isLastColumnSticky),
  isSelectable: computed(() => props.isSelectable),
  columns: computed(() => props.columns),
  data: computed(() => props.data),
  getKey: props.getKey,
  groupBy: computed(() => props.groupBy),
})

useProvideDataTableContext({
  isColumnResizeDisabled: computed(() => props.isColumnResizeDisabled),
  isFirstColumnSticky: computed(() => props.isFirstColumnSticky),
  isLastColumnSticky: computed(() => props.isLastColumnSticky),
  isLeadingStickyRegionActive,
  leadingStickyOffsetsPx,
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  setColumnSize,
  sort: computed(() => props.sort),
})

const isGroupingEnabled = computed<boolean>(() => props.groupBy !== null)

const rows = computed<Row<TItem>[]>(() => table.getRowModel().rows)

const {
  paddingAfterPx: flatPaddingAfterPx,
  paddingBeforePx: flatPaddingBeforePx,
  virtualItems: flatVirtualRows,
} = useDataTableVirtualScroller(
  computed(() => (isGroupingEnabled.value ? 0 : props.data.length)),
  scrollContainerEl,
)

const {
  measureRowElement,
  paddingAfterPx: groupedPaddingAfterPx,
  paddingBeforePx: groupedPaddingBeforePx,
  virtualItems: groupedVirtualRows,
} = useDataTableGroupedVirtualScroller(rows, scrollContainerEl)

const paddingBeforePx = computed<number>(
  () => (isGroupingEnabled.value ? groupedPaddingBeforePx.value : flatPaddingBeforePx.value),
)
const paddingAfterPx = computed<number>(
  () => (isGroupingEnabled.value ? groupedPaddingAfterPx.value : flatPaddingAfterPx.value),
)

const {
  isAllSelected,
  isGroupAllSelected,
  isGroupIndeterminate,
  isIndeterminate,
  isItemSelected,
  toggleAll,
  toggleGroup,
  toggleItem,
} = useTableSelection(
  computed(() => props.data),
  props.getKey,
  (state) => emit('select', state),
)

const selectedItems = computed<TItem[]>(
  () => props.data.filter((item) => isItemSelected(props.getKey(item))),
)

const selectedActionModels = computed<RegisteredActionContext['models']>(() => {
  const models = selectedItems.value.map((item) => props.getActionModel?.(item))

  return models.filter((model): model is RegisteredActionContext['models'][number] => model != null)
})

// Mobile-only: selection is off by default and toggled on explicitly (see `CONTEXT.md`),
// separate from `props.isSelectable`'s always-on desktop checkbox column.
const isMobileSelectModeOn = shallowRef<boolean>(false)

function toggleMobileSelectMode(): void {
  isMobileSelectModeOn.value = !isMobileSelectModeOn.value
}

const expandedMobileCardKeys = shallowRef<Set<string>>(new Set())

function toggleMobileCardExpanded(key: string): void {
  const updated = new Set(expandedMobileCardKeys.value)

  if (updated.has(key)) {
    updated.delete(key)
  }
  else {
    updated.add(key)
  }

  expandedMobileCardKeys.value = updated
}

// Sub-component expand state is deliberately kept outside TanStack's own `expanded` state,
// which is reserved for group-row collapse — see `CONTEXT.md`.
const expandedSubComponentRowIds = shallowRef<Set<string>>(new Set())

function toggleSubComponent(rowId: string): void {
  const updated = new Set(expandedSubComponentRowIds.value)

  if (updated.has(rowId)) {
    updated.delete(rowId)
  }
  else {
    updated.add(rowId)
  }

  expandedSubComponentRowIds.value = updated
}

function getGroupRowLabelCell(row: Row<TItem>): DataTableCellDefinition | null {
  const groupColumnId = row.groupingColumnId

  if (groupColumnId === undefined) {
    return null
  }

  const column = props.columns.find((c) => c.key === groupColumnId)

  if (column === undefined) {
    return null
  }

  // `row.original` for any grouped row (at any nesting depth) is TanStack's own representative
  // leaf item for that group — see `getGroupedRowModel.ts`'s `createRow(table, id, leafRows[0].original, ...)`.
  return column.cell(row.original)
}

const rowViewModels = computed<DataTableRowViewModel<TItem>[]>(() => {
  const allRows = table.getRowModel().rows

  return allRows.map((row, index) => {
    const isGrouped = row.getIsGrouped()
    const subComponent = isGrouped ? null : (subComponentByItemKey.value.get(props.getKey(row.original)) ?? null)
    const groupItems = isGrouped ? row.getLeafRows().map((leafRow) => leafRow.original) : []

    return {
      isGroupAllSelected: isGrouped && isGroupAllSelected(groupItems),
      isGrouped,
      isGroupIndeterminate: isGrouped && isGroupIndeterminate(groupItems),
      isLast: index === allRows.length - 1,
      isSelected: !isGrouped && isItemSelected(props.getKey(row.original)),
      isSubComponentExpanded: expandedSubComponentRowIds.value.has(row.id),
      canExpandSubComponent: subComponent !== null,
      groupLabel: isGrouped ? String(row.groupingValue) : '',
      groupLabelCell: isGrouped ? getGroupRowLabelCell(row) : null,
      row,
      subComponent,
    }
  })
})

function toggleRowGroup(row: Row<TItem>): void {
  toggleGroup(row.getLeafRows().map((leafRow) => leafRow.original))
}

interface GroupedVirtualRowViewModel {
  index: number
  key: number | string
  row: Row<TItem>
  viewModel: DataTableRowViewModel<TItem>
}

const groupedVirtualRowViewModels = computed<GroupedVirtualRowViewModel[]>(
  () => groupedVirtualRows.value.map((virtualRow) => ({
    index: virtualRow.index,
    key: String(virtualRow.key),
    row: rows.value[virtualRow.index]!,
    viewModel: rowViewModels.value[virtualRow.index]!,
  })),
)

interface FlatVirtualRowViewModel {
  key: string
  viewModel: DataTableRowViewModel<TItem>
}

const flatVirtualRowViewModels = computed<FlatVirtualRowViewModel[]>(
  () => flatVirtualRows.value.map((virtualRow) => ({
    key: rows.value[virtualRow.index]!.id,
    viewModel: rowViewModels.value[virtualRow.index]!,
  })),
)

interface VisibleColumn {
  id: string
  header: Header<TItem, unknown>
  headerLabel: string
}

const visibleColumns = computed<VisibleColumn[]>(() => {
  const columnByKey = new Map(props.columns.map((column) => [
    column.key,
    column,
  ]))

  return table.getFlatHeaders().map((header) => ({
    id: header.column.id,
    header,
    headerLabel: columnByKey.get(header.column.id)?.headerLabel ?? header.column.id,
  }))
})
</script>

<template>
  <div
    class="@container/data-table relative flex size-full min-w-0 flex-col"
  >
    <div
      v-if="props.isSelectable"
      class="
        flex items-center justify-end px-xl py-lg
        @md/data-table:hidden
      "
    >
      <button
        class="text-xs font-medium text-brand-primary outline-none"
        type="button"
        @click="toggleMobileSelectMode"
      >
        {{ isMobileSelectModeOn
          ? i18n.t('component.data_table.mobile_list.cancel_select_label')
          : i18n.t('component.data_table.mobile_list.select_label') }}
      </button>
    </div>

    <DataTableMobileList
      :columns="props.columns"
      :expanded-item-keys="expandedMobileCardKeys"
      :get-key="props.getKey"
      :get-link="props.getLink"
      :is-item-selected="isItemSelected"
      :is-selectable="isMobileSelectModeOn"
      :mobile-card="props.mobileCard"
      :row-view-models="rowViewModels"
      class="
        min-h-0 flex-1
        @md/data-table:hidden
      "
      @toggle-expanded="toggleMobileCardExpanded"
      @toggle-group-selected="toggleGroup"
      @toggle-selected="toggleItem"
    />

    <div
      ref="scrollContainerEl"
      class="
        hidden max-h-full w-full min-w-0 overflow-auto rounded-xl border
        border-secondary contain-layout contain-paint
        @md/data-table:block
      "
    >
      <div
        :style="{ gridTemplateColumns }"
        class="grid w-max min-w-full"
        role="table"
      >
        <div
          class="contents"
          role="rowgroup"
        >
          <div
            class="contents"
            role="row"
          >
            <DataTableHeaderCheckboxCell
              v-if="props.isSelectable"
              :is-checked="isAllSelected"
              :is-indeterminate="isIndeterminate && !isAllSelected"
              @toggle="toggleAll"
            />

            <div
              v-if="hasSubComponent"
              :style="{
                left: isLeadingStickyRegionActive ? `${leadingStickyOffsetsPx.expand}px` : undefined,
              }"
              :class="{
                'z-30': isLeadingStickyRegionActive,
              }"
              class="
                sticky top-0 z-20 flex h-10 items-center border-b
                border-secondary bg-secondary px-xl
              "
              role="columnheader"
            />

            <DataTableHeaderCell
              v-for="(column, columnIndex) of visibleColumns"
              :key="column.id"
              :column-key="column.id"
              :header="column.header"
              :is-last-column-overall="columnIndex === visibleColumns.length - 1"
              :label="column.headerLabel"
            />
          </div>
        </div>

        <div
          class="contents"
          role="rowgroup"
        >
          <DataTableVirtualRows
            v-if="isGroupingEnabled"
            :padding-after-px="paddingAfterPx"
            :padding-before-px="paddingBeforePx"
          >
            <div
              v-for="entry of groupedVirtualRowViewModels"
              :key="entry.key"
              :ref="measureRowElement"
              :data-index="entry.index"
              class="col-span-full grid grid-cols-subgrid"
            >
              <DataTableGroupRow
                v-if="entry.viewModel.isGrouped"
                :depth="entry.row.depth"
                :is-expanded="entry.row.getIsExpanded()"
                :is-last="entry.viewModel.isLast"
                :is-selectable="props.isSelectable"
                :is-selected="entry.viewModel.isGroupAllSelected"
                :is-selected-indeterminate="entry.viewModel.isGroupIndeterminate && !entry.viewModel.isGroupAllSelected"
                :label="entry.viewModel.groupLabelCell === null ? entry.viewModel.groupLabel : ''"
                @toggle="entry.row.toggleExpanded()"
                @toggle-selected="toggleRowGroup(entry.row)"
              >
                <DataTableCellRenderer
                  v-if="entry.viewModel.groupLabelCell !== null"
                  :cell="entry.viewModel.groupLabelCell!"
                />
              </DataTableGroupRow>

              <DataTableDataRow
                v-else
                :has-sub-component="hasSubComponent"
                :is-selectable="props.isSelectable"
                :view-model="entry.viewModel"
                @toggle-selected="toggleItem(props.getKey(entry.row.original))"
                @toggle-sub-component="toggleSubComponent(entry.row.id)"
              />
            </div>
          </DataTableVirtualRows>

          <DataTableVirtualRows
            v-else
            :padding-after-px="paddingAfterPx"
            :padding-before-px="paddingBeforePx"
          >
            <DataTableDataRow
              v-for="entry of flatVirtualRowViewModels"
              :key="entry.key"
              :has-sub-component="hasSubComponent"
              :is-selectable="props.isSelectable"
              :view-model="entry.viewModel"
              @toggle-selected="toggleItem(props.getKey(entry.viewModel.row.original))"
              @toggle-sub-component="toggleSubComponent(entry.viewModel.row.id)"
            />
          </DataTableVirtualRows>
        </div>
      </div>
    </div>

    <DataTableSelectionActionBar
      v-if="props.isSelectable"
      :actions="props.selectionActions"
      :models="selectedActionModels"
      :selected-count="selectedItems.length"
    />
  </div>
</template>
