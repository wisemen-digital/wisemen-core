<script setup lang="ts" generic="TItem">
import type {
  Header,
  Row,
} from '@tanstack/vue-table'
import type { ApiError } from '@wisemen/vue-core-api-utils'
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
import DataTableLoadingRows from '@/ui/data-table/components/DataTableLoadingRows.vue'
import DataTableMobileList from '@/ui/data-table/components/DataTableMobileList.vue'
import DataTableSelectionActionBar from '@/ui/data-table/components/DataTableSelectionActionBar.vue'
import DataTableVirtualRows from '@/ui/data-table/components/DataTableVirtualRows.vue'
import { useDataTable } from '@/ui/data-table/composables/dataTable.composable'
import {
  DATA_TABLE_ROW_HEIGHT_IN_PX,
  useDataTableGroupedVirtualScroller,
} from '@/ui/data-table/composables/dataTableGroupedVirtualScroller.composable'
import { useDataTableInfiniteScroll } from '@/ui/data-table/composables/dataTableInfiniteScroll.composable'
import { useDataTableStickyGroupChunks } from '@/ui/data-table/composables/dataTableStickyGroupChunks.composable'
import { useDataTableVirtualScroller } from '@/ui/data-table/composables/dataTableVirtualScroller.composable'
import { useProvideDataTableContext } from '@/ui/data-table/context/dataTable.context'
import type { DataTableProps } from '@/ui/data-table/types/dataTable.props'
import type { DataTableCell as DataTableCellDefinition } from '@/ui/data-table/types/dataTableCell.type'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'
import { UIEmptyState } from '@/ui/empty-state/index'
import { UIErrorState } from '@/ui/error-state/index'
import { useTableSelection } from '@/ui/table/composables/tableSelection.composable'
import type { TableSelectionState } from '@/ui/table/types/table.type'

const props = withDefaults(defineProps<DataTableProps<TItem>>(), {
  isColumnResizeDisabled: false,
  isFetchingNextPage: false,
  isFirstColumnSticky: true,
  isLastColumnSticky: false,
  isLoading: false,
  isSelectable: false,
  error: null,
  groupBy: null,
  mobileCard: null,
  row: null,
  selectionActions: () => [],
  sort: null,
  subComponent: null,
  totalCount: null,
  onNextPage: null,
})

const emit = defineEmits<{
  select: [state: TableSelectionState<TItem>]
}>()

const i18n = useI18n()

const scrollContainerEl = shallowRef<HTMLElement | null>(null)

useDataTableInfiniteScroll(scrollContainerEl, computed(() => props.onNextPage))

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

// Static per-table, not per-row — the trailing actions column's width is always reserved
// once `row` is configured at all, so column edges stay aligned even for rows whose own
// `row(item)` resolves to no actions.
const hasRowActions = computed<boolean>(() => props.row !== null)

const {
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  isLeadingStickyRegionActive,
  gridTemplateColumns,
  leadingStickyOffsetsPx,
  setColumnSize,
  table,
} = useDataTable({
  hasRowActions,
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
  leftStickyBorderColumnId,
  leftStickyOffsetPxByColumnId,
  rightStickyBorderColumnId,
  rightStickyOffsetPxByColumnId,
  isColumnResizeDisabled: computed(() => props.isColumnResizeDisabled),
  isFirstColumnSticky: computed(() => props.isFirstColumnSticky),
  isLastColumnSticky: computed(() => props.isLastColumnSticky),
  isLeadingStickyRegionActive,
  leadingStickyOffsetsPx,
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
  paddingBeforePx: groupedPaddingBeforePxFromVirtualizer,
  virtualItems: groupedVirtualRows,
} = useDataTableGroupedVirtualScroller(rows, scrollContainerEl)

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

// While select-all is active, `props.totalCount` (the true server-side match count, if known)
// takes over from the loaded-rows count — otherwise the displayed count would silently climb
// as more pages load in via `onNextPage`, with no indication it was never a stable total.
const selectedCount = computed<number>(
  () => (isAllSelected.value && props.totalCount !== null ? props.totalCount : selectedItems.value.length),
)

const selectedActionModels = computed<RegisteredActionContext['models']>(() => {
  const models = selectedItems.value.map((item) => props.row?.(item)?.model)

  return models.filter((model): model is RegisteredActionContext['models'][number] => model != null)
})

// Mobile-only: selection is off by default and toggled on explicitly, separate from
// `props.isSelectable`'s always-on desktop checkbox column.
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
// which is reserved for group-row collapse.
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
      rowConfig: isGrouped ? null : (props.row?.(row.original) ?? null),
      subComponent,
    }
  })
})

function toggleRowGroup(row: Row<TItem>): void {
  toggleGroup(row.getLeafRows().map((leafRow) => leafRow.original))
}

const {
  chunks: groupedVirtualRowChunks,
  getChunkGroupHeaderEntry,
  getSubChunkDataRowEntries,
  getSubChunkSubgroupHeaderEntry,
  paddingBeforePx: groupedPaddingBeforePx,
} = useDataTableStickyGroupChunks({
  getRowAtIndex: (index) => rows.value[index]!,
  getViewModelAtIndex: (index) => rowViewModels.value[index]!,
  groupHeaderHeightPx: DATA_TABLE_ROW_HEIGHT_IN_PX,
  paddingBeforePxFromVirtualizer: groupedPaddingBeforePxFromVirtualizer,
  virtualItems: groupedVirtualRows,
})

const paddingBeforePx = computed<number>(
  () => (isGroupingEnabled.value ? groupedPaddingBeforePx.value : flatPaddingBeforePx.value),
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

// Matches the grid's actual track count — leading checkbox/expand and trailing actions tracks
// (none of which are real TanStack columns) plus one per real column — so
// `DataTableLoadingRows`'s subgrid rows span the full width instead of leaving empty tracks.
const loadingRowColumnCount = computed<number>(
  () => (props.isSelectable ? 1 : 0)
    + (hasSubComponent.value ? 1 : 0)
    + (hasRowActions.value ? 1 : 0)
    + visibleColumns.value.length,
)
</script>

<template>
  <div
    class="@container/data-table relative flex size-full min-w-0 flex-col"
  >
    <slot
      v-if="props.error !== null"
      :error="(props.error as ApiError)"
      name="error"
    >
      <UIErrorState
        :error="props.error"
        class="mx-auto h-full max-w-96 py-xl"
      />
    </slot>

    <UIEmptyState
      v-else-if="props.data.length === 0 && !props.isLoading"
      :title="i18n.t('component.data_table.empty_state.no_data.title')"
      :description="i18n.t('component.data_table.empty_state.no_data.description')"
      illustration="cloud-search"
      class="mx-auto h-full max-w-96 py-xl"
    />

    <template v-else>
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
        :is-item-selected="isItemSelected"
        :is-selectable="isMobileSelectModeOn"
        :mobile-card="props.mobileCard"
        :on-next-page="props.onNextPage"
        :row="props.row"
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

              <div
                v-if="hasRowActions"
                class="
                  sticky top-0 right-0 z-20 flex h-10 items-center border-b
                  border-l border-secondary bg-secondary px-xl
                "
                role="columnheader"
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
                v-for="chunk of groupedVirtualRowChunks"
                :key="chunk.key"
                class="relative col-span-full grid grid-cols-subgrid"
              >
                <div
                  v-for="groupHeaderEntry of getChunkGroupHeaderEntry(chunk)"
                  :key="groupHeaderEntry.key"
                  :ref="measureRowElement"
                  :data-index="groupHeaderEntry.index"
                  class="
                    sticky top-10 z-10 col-span-full grid grid-cols-subgrid
                  "
                >
                  <DataTableGroupRow
                    :depth="0"
                    :is-expanded="groupHeaderEntry.viewModel.row.getIsExpanded()"
                    :is-last="groupHeaderEntry.viewModel.isLast"
                    :is-selectable="props.isSelectable"
                    :is-selected="groupHeaderEntry.viewModel.isGroupAllSelected"
                    :is-selected-indeterminate="groupHeaderEntry.viewModel.isGroupIndeterminate
                      && !groupHeaderEntry.viewModel.isGroupAllSelected"
                    :label="groupHeaderEntry.viewModel.groupLabelCell === null
                      ? groupHeaderEntry.viewModel.groupLabel : ''"
                    @toggle="groupHeaderEntry.viewModel.row.toggleExpanded()"
                    @toggle-selected="toggleRowGroup(groupHeaderEntry.viewModel.row)"
                  >
                    <DataTableCellRenderer
                      v-if="groupHeaderEntry.viewModel.groupLabelCell !== null"
                      :cell="groupHeaderEntry.viewModel.groupLabelCell!"
                    />
                  </DataTableGroupRow>
                </div>

                <div
                  v-for="subChunk of chunk.subChunks"
                  :key="subChunk.key"
                  class="relative col-span-full grid grid-cols-subgrid"
                >
                  <div
                    v-for="subgroupHeaderEntry of getSubChunkSubgroupHeaderEntry(subChunk)"
                    :key="subgroupHeaderEntry.key"
                    :ref="measureRowElement"
                    :data-index="subgroupHeaderEntry.index"
                    class="
                      sticky top-20 z-5 col-span-full grid grid-cols-subgrid
                    "
                  >
                    <DataTableGroupRow
                      :depth="subgroupHeaderEntry.viewModel.row.depth"
                      :is-expanded="subgroupHeaderEntry.viewModel.row.getIsExpanded()"
                      :is-last="subgroupHeaderEntry.viewModel.isLast"
                      :is-selectable="props.isSelectable"
                      :is-selected="subgroupHeaderEntry.viewModel.isGroupAllSelected"
                      :is-selected-indeterminate="subgroupHeaderEntry.viewModel.isGroupIndeterminate
                        && !subgroupHeaderEntry.viewModel.isGroupAllSelected"
                      :label="subgroupHeaderEntry.viewModel.groupLabelCell === null
                        ? subgroupHeaderEntry.viewModel.groupLabel : ''"
                      @toggle="subgroupHeaderEntry.viewModel.row.toggleExpanded()"
                      @toggle-selected="toggleRowGroup(subgroupHeaderEntry.viewModel.row)"
                    >
                      <DataTableCellRenderer
                        v-if="subgroupHeaderEntry.viewModel.groupLabelCell !== null"
                        :cell="subgroupHeaderEntry.viewModel.groupLabelCell!"
                      />
                    </DataTableGroupRow>
                  </div>

                  <div
                    v-for="entry of getSubChunkDataRowEntries(subChunk)"
                    :key="entry.key"
                    :ref="measureRowElement"
                    :data-index="entry.index"
                    class="col-span-full grid grid-cols-subgrid"
                  >
                    <DataTableDataRow
                      :has-row-actions="hasRowActions"
                      :has-sub-component="hasSubComponent"
                      :is-selectable="props.isSelectable"
                      :view-model="entry.viewModel"
                      @toggle-selected="toggleItem(props.getKey(entry.viewModel.row.original))"
                      @toggle-sub-component="toggleSubComponent(entry.viewModel.row.id)"
                    />
                  </div>
                </div>
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
                :has-row-actions="hasRowActions"
                :has-sub-component="hasSubComponent"
                :is-selectable="props.isSelectable"
                :view-model="entry.viewModel"
                @toggle-selected="toggleItem(props.getKey(entry.viewModel.row.original))"
                @toggle-sub-component="toggleSubComponent(entry.viewModel.row.id)"
              />
            </DataTableVirtualRows>

            <DataTableLoadingRows
              v-if="props.isLoading || props.isFetchingNextPage"
              :column-count="loadingRowColumnCount"
              :grid-template-columns="gridTemplateColumns"
            />
          </div>
        </div>
      </div>
    </template>

    <DataTableSelectionActionBar
      v-if="props.isSelectable"
      :actions="props.selectionActions"
      :models="selectedActionModels"
      :selected-count="selectedCount"
    />
  </div>
</template>
