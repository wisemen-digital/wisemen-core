<script setup lang="ts" generic="TItem extends RowData">
import type { RowData } from '@tanstack/vue-table'
import {
  computed,
  shallowRef,
} from 'vue'

import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import DataTableMobileCard from '@/ui/data-table/components/DataTableMobileCard.vue'
import DataTableMobileGroupHeader from '@/ui/data-table/components/DataTableMobileGroupHeader.vue'
import { useDataTableInfiniteScroll } from '@/ui/data-table/composables/dataTableInfiniteScroll.composable'
import { useDataTableMobileSlots } from '@/ui/data-table/composables/dataTableMobileSlots.composable'
import {
  DATA_TABLE_MOBILE_GROUP_HEADER_HEIGHT_IN_PX,
  useDataTableMobileVirtualScroller,
} from '@/ui/data-table/composables/dataTableMobileVirtualScroller.composable'
import { useDataTableStickyGroupChunks } from '@/ui/data-table/composables/dataTableStickyGroupChunks.composable'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

const props = withDefaults(defineProps<{
  hasVisibleSelectionActionBar?: boolean
  isItemSelected: (key: string) => boolean
  isSelectable?: boolean
  columns: DataTableColumn<TItem>[]
  expandedItemKeys: Set<string>
  getKey: (item: TItem) => string
  mobileCard: DataTableMobileCardConfig | null
  row?: ((item: TItem) => DataTableRowConfig | null) | null
  rowViewModels: DataTableRowViewModel<TItem>[]
  onNextPage?: (() => void) | null
}>(), {
  hasVisibleSelectionActionBar: false,
  isSelectable: false,
  row: null,
  onNextPage: null,
})

const emit = defineEmits<{
  toggleExpanded: [key: string]
  toggleGroupSelected: [items: TItem[]]
  toggleSelected: [key: string]
}>()

const {
  getMobileSlots,
} = useDataTableMobileSlots(computed(() => props.columns), computed(() => props.mobileCard))

const scrollContainerEl = shallowRef<HTMLElement | null>(null)

useDataTableInfiniteScroll(scrollContainerEl, computed(() => props.onNextPage))

const {
  measureRowElement,
  paddingAfterPx,
  paddingBeforePx: paddingBeforePxFromVirtualizer,
  virtualItems,
} = useDataTableMobileVirtualScroller(computed(() => props.rowViewModels), scrollContainerEl)

const {
  chunks: virtualRowChunks,
  getChunkGroupHeaderEntry,
  getSubChunkDataRowEntries,
  getSubChunkSubgroupHeaderEntry,
  paddingBeforePx,
} = useDataTableStickyGroupChunks({
  getRowAtIndex: (index) => props.rowViewModels[index]!.row,
  getViewModelAtIndex: (index) => props.rowViewModels[index]!,
  groupHeaderHeightPx: DATA_TABLE_MOBILE_GROUP_HEADER_HEIGHT_IN_PX,
  paddingBeforePxFromVirtualizer,
  virtualItems,
})
</script>

<template>
  <div
    ref="scrollContainerEl"
    class="max-h-full w-full overflow-auto"
  >
    <div role="table">
      <div
        v-if="paddingBeforePx > 0"
        :style="{ height: `${paddingBeforePx}px` }"
      />

      <div
        v-for="chunk of virtualRowChunks"
        :key="chunk.key"
        class="relative"
      >
        <div
          v-for="groupHeaderEntry of getChunkGroupHeaderEntry(chunk)"
          :key="groupHeaderEntry.key"
          :ref="measureRowElement"
          :data-index="groupHeaderEntry.index"
          class="sticky top-0 z-20 bg-primary"
        >
          <DataTableMobileGroupHeader
            :depth="0"
            :is-expanded="groupHeaderEntry.viewModel.row.getIsExpanded()"
            :is-selectable="props.isSelectable"
            :is-selected="groupHeaderEntry.viewModel.isGroupAllSelected"
            :is-selected-indeterminate="groupHeaderEntry.viewModel.isGroupIndeterminate
              && !groupHeaderEntry.viewModel.isGroupAllSelected"
            :label="groupHeaderEntry.viewModel.groupLabelCell === null
              ? groupHeaderEntry.viewModel.groupLabel : ''"
            @toggle="groupHeaderEntry.viewModel.row.toggleExpanded()"
            @toggle-selected="emit('toggleGroupSelected', groupHeaderEntry.viewModel.row.getLeafRows().map((leafRow) => leafRow.original))"
          >
            <DataTableCellRenderer
              v-if="groupHeaderEntry.viewModel.groupLabelCell !== null"
              :cell="groupHeaderEntry.viewModel.groupLabelCell!"
            />
          </DataTableMobileGroupHeader>
        </div>

        <div
          v-for="subChunk of chunk.subChunks"
          :key="subChunk.key"
          class="relative"
        >
          <div
            v-for="subgroupHeaderEntry of getSubChunkSubgroupHeaderEntry(subChunk)"
            :key="subgroupHeaderEntry.key"
            :ref="measureRowElement"
            :data-index="subgroupHeaderEntry.index"
            class="sticky top-9 z-10 bg-primary"
          >
            <DataTableMobileGroupHeader
              :depth="subgroupHeaderEntry.viewModel.row.depth"
              :is-expanded="subgroupHeaderEntry.viewModel.row.getIsExpanded()"
              :is-selectable="props.isSelectable"
              :is-selected="subgroupHeaderEntry.viewModel.isGroupAllSelected"
              :is-selected-indeterminate="subgroupHeaderEntry.viewModel.isGroupIndeterminate
                && !subgroupHeaderEntry.viewModel.isGroupAllSelected"
              :label="subgroupHeaderEntry.viewModel.groupLabelCell === null
                ? subgroupHeaderEntry.viewModel.groupLabel : ''"
              @toggle="subgroupHeaderEntry.viewModel.row.toggleExpanded()"
              @toggle-selected="emit('toggleGroupSelected', subgroupHeaderEntry.viewModel.row.getLeafRows().map((leafRow) => leafRow.original))"
            >
              <DataTableCellRenderer
                v-if="subgroupHeaderEntry.viewModel.groupLabelCell !== null"
                :cell="subgroupHeaderEntry.viewModel.groupLabelCell!"
              />
            </DataTableMobileGroupHeader>
          </div>

          <div
            v-for="entry of getSubChunkDataRowEntries(subChunk)"
            :key="entry.key"
            :ref="measureRowElement"
            :data-index="entry.index"
          >
            <DataTableMobileCard
              v-bind="getMobileSlots(entry.viewModel.row.original)"
              :inline-actions="entry.viewModel.rowConfig?.actions?.inline ?? []"
              :is-expanded="props.expandedItemKeys.has(props.getKey(entry.viewModel.row.original))"
              :is-last="entry.viewModel.isLast"
              :is-selectable="props.isSelectable"
              :is-selected="props.isItemSelected(props.getKey(entry.viewModel.row.original))"
              :model="entry.viewModel.rowConfig?.model ?? null"
              :more-actions="entry.viewModel.rowConfig?.actions?.more ?? []"
              :on-click="entry.viewModel.rowConfig?.onClick ?? null"
              :sub-component="entry.viewModel.subComponent"
              @toggle-expanded="emit('toggleExpanded', props.getKey(entry.viewModel.row.original))"
              @toggle-selected="emit('toggleSelected', props.getKey(entry.viewModel.row.original))"
            />
          </div>
        </div>
      </div>

      <div
        v-if="paddingAfterPx > 0"
        :style="{ height: `${paddingAfterPx}px` }"
      />

      <div
        v-if="props.hasVisibleSelectionActionBar"
        class="h-[calc(env(safe-area-inset-bottom)+4rem)]"
      />
    </div>
  </div>
</template>
