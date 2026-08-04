<script setup lang="ts" generic="TItem">
import type {
  Header,
  Row,
} from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import type { Component } from 'vue'
import {
  computed,
  shallowRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'
import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import DataTableCheckboxCell from '@/ui/data-table/components/DataTableCheckboxCell.vue'
import DataTableExpandCell from '@/ui/data-table/components/DataTableExpandCell.vue'
import DataTableGroupRow from '@/ui/data-table/components/DataTableGroupRow.vue'
import DataTableHeaderCell from '@/ui/data-table/components/DataTableHeaderCell.vue'
import DataTableHeaderCheckboxCell from '@/ui/data-table/components/DataTableHeaderCheckboxCell.vue'
import DataTableMobileList from '@/ui/data-table/components/DataTableMobileList.vue'
import DataTableRow from '@/ui/data-table/components/DataTableRow.vue'
import DataTableSelectionActionBar from '@/ui/data-table/components/DataTableSelectionActionBar.vue'
import DataTableSubComponentRow from '@/ui/data-table/components/DataTableSubComponentRow.vue'
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
  isFirstColumnSticky: false,
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
  pinFirstColumn,
  pinLastColumn,
  setColumnSize,
  table,
} = useDataTable({
  hasSubComponent,
  isColumnResizeDisabled: computed(() => props.isColumnResizeDisabled),
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

const rowViewModels = computed<DataTableRowViewModel<TItem>[]>(() => table.getRowModel().rows.map((row) => {
  const isGrouped = row.getIsGrouped()
  const subComponent = isGrouped ? null : (subComponentByItemKey.value.get(props.getKey(row.original)) ?? null)
  const groupItems = isGrouped ? row.getLeafRows().map((leafRow) => leafRow.original) : []

  return {
    isGroupAllSelected: isGrouped && isGroupAllSelected(groupItems),
    isGrouped,
    isGroupIndeterminate: isGrouped && isGroupIndeterminate(groupItems),
    isSelected: !isGrouped && isItemSelected(props.getKey(row.original)),
    isSubComponentExpanded: expandedSubComponentRowIds.value.has(row.id),
    canExpandSubComponent: subComponent !== null,
    groupLabel: isGrouped ? String(row.groupingValue) : '',
    groupLabelCell: isGrouped ? getGroupRowLabelCell(row) : null,
    row,
    subComponent,
  }
}))

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

watch(() => props.isFirstColumnSticky, pinFirstColumn, {
  immediate: true,
})
watch(() => props.isLastColumnSticky, pinLastColumn, {
  immediate: true,
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
      class="@md/data-table:hidden"
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
              role="columnheader"
            />

            <DataTableHeaderCell
              v-for="(column, columnIndex) of visibleColumns"
              :key="column.id"
              :column-key="column.id"
              :header="column.header"
              :is-first-column="!props.isSelectable && !hasSubComponent && columnIndex === 0"
              :is-last-column="columnIndex === visibleColumns.length - 1"
              :label="column.headerLabel"
            />
          </div>
        </div>

        <div
          class="contents"
          role="rowgroup"
        >
          <template v-if="isGroupingEnabled">
            <div
              v-if="paddingBeforePx > 0"
              :style="{ height: `${paddingBeforePx}px` }"
              class="col-span-full"
            />

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

              <template v-else>
                <DataTableRow>
                  <DataTableCheckboxCell
                    v-if="props.isSelectable"
                    :is-checked="entry.viewModel.isSelected"
                    @toggle="toggleItem(props.getKey(entry.row.original))"
                  />

                  <DataTableExpandCell
                    v-if="hasSubComponent"
                    :can-expand="entry.viewModel.canExpandSubComponent"
                    :is-expanded="entry.viewModel.isSubComponentExpanded"
                    @toggle="toggleSubComponent(entry.row.id)"
                  />

                  <DataTableCell
                    v-for="(cell, cellIndex) of entry.row.getVisibleCells()"
                    :key="cell.column.id"
                    :is-first-column="!props.isSelectable && !hasSubComponent && cellIndex === 0"
                    :is-last-column="cellIndex === entry.row.getVisibleCells().length - 1"
                  >
                    <FlexRender
                      :props="cell.getContext()"
                      :render="cell.column.columnDef.cell"
                    />
                  </DataTableCell>
                </DataTableRow>

                <DataTableSubComponentRow v-if="entry.viewModel.isSubComponentExpanded">
                  <Component :is="entry.viewModel.subComponent" />
                </DataTableSubComponentRow>
              </template>
            </div>

            <div
              v-if="paddingAfterPx > 0"
              :style="{ height: `${paddingAfterPx}px` }"
              class="col-span-full"
            />
          </template>

          <template v-else>
            <div
              v-if="paddingBeforePx > 0"
              :style="{ height: `${paddingBeforePx}px` }"
              class="col-span-full"
            />

            <template
              v-for="virtualRow of flatVirtualRows"
              :key="rows[virtualRow.index]!.id"
            >
              <DataTableRow>
                <DataTableCheckboxCell
                  v-if="props.isSelectable"
                  :is-checked="rowViewModels[virtualRow.index]!.isSelected"
                  @toggle="toggleItem(props.getKey(rows[virtualRow.index]!.original))"
                />

                <DataTableExpandCell
                  v-if="hasSubComponent"
                  :can-expand="rowViewModels[virtualRow.index]!.canExpandSubComponent"
                  :is-expanded="rowViewModels[virtualRow.index]!.isSubComponentExpanded"
                  @toggle="toggleSubComponent(rows[virtualRow.index]!.id)"
                />

                <DataTableCell
                  v-for="(cell, cellIndex) of rows[virtualRow.index]!.getVisibleCells()"
                  :key="cell.column.id"
                  :is-first-column="!props.isSelectable && !hasSubComponent && cellIndex === 0"
                  :is-last-column="cellIndex === rows[virtualRow.index]!.getVisibleCells().length - 1"
                >
                  <FlexRender
                    :props="cell.getContext()"
                    :render="cell.column.columnDef.cell"
                  />
                </DataTableCell>
              </DataTableRow>

              <DataTableSubComponentRow v-if="rowViewModels[virtualRow.index]!.isSubComponentExpanded">
                <Component :is="rowViewModels[virtualRow.index]!.subComponent" />
              </DataTableSubComponentRow>
            </template>

            <div
              v-if="paddingAfterPx > 0"
              :style="{ height: `${paddingAfterPx}px` }"
              class="col-span-full"
            />
          </template>
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
