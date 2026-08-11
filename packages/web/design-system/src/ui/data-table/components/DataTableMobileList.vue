<script setup lang="ts" generic="TItem">
import {
  computed,
  shallowRef,
} from 'vue'

import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import DataTableMobileCard from '@/ui/data-table/components/DataTableMobileCard.vue'
import DataTableMobileGroupHeader from '@/ui/data-table/components/DataTableMobileGroupHeader.vue'
import { useDataTableInfiniteScroll } from '@/ui/data-table/composables/dataTableInfiniteScroll.composable'
import { useDataTableMobileSlots } from '@/ui/data-table/composables/dataTableMobileSlots.composable'
import { useDataTableMobileVirtualScroller } from '@/ui/data-table/composables/dataTableMobileVirtualScroller.composable'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

const props = withDefaults(defineProps<{
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
  paddingBeforePx,
  virtualItems,
} = useDataTableMobileVirtualScroller(computed(() => props.rowViewModels), scrollContainerEl)

interface MobileVirtualRowViewModel {
  index: number
  itemKey: string
  key: string
  viewModel: DataTableRowViewModel<TItem>
}

const virtualRowViewModels = computed<MobileVirtualRowViewModel[]>(
  () => virtualItems.value.map((virtualItem) => {
    const viewModel = props.rowViewModels[virtualItem.index]!

    return {
      index: virtualItem.index,
      itemKey: viewModel.isGrouped ? '' : props.getKey(viewModel.row.original),
      key: String(virtualItem.key),
      viewModel,
    }
  }),
)
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

      <template
        v-for="entry of virtualRowViewModels"
        :key="entry.key"
      >
        <div
          :ref="measureRowElement"
          :data-index="entry.index"
        >
          <DataTableMobileGroupHeader
            v-if="entry.viewModel.isGrouped"
            :depth="entry.viewModel.row.depth"
            :is-expanded="entry.viewModel.row.getIsExpanded()"
            :is-selectable="props.isSelectable"
            :is-selected="entry.viewModel.isGroupAllSelected"
            :is-selected-indeterminate="entry.viewModel.isGroupIndeterminate && !entry.viewModel.isGroupAllSelected"
            :label="entry.viewModel.groupLabelCell === null ? entry.viewModel.groupLabel : ''"
            @toggle="entry.viewModel.row.toggleExpanded()"
            @toggle-selected="emit('toggleGroupSelected', entry.viewModel.row.getLeafRows().map((leafRow) => leafRow.original))"
          >
            <DataTableCellRenderer
              v-if="entry.viewModel.groupLabelCell !== null"
              :cell="entry.viewModel.groupLabelCell!"
            />
          </DataTableMobileGroupHeader>

          <DataTableMobileCard
            v-else
            v-bind="getMobileSlots(entry.viewModel.row.original)"
            :is-expanded="props.expandedItemKeys.has(entry.itemKey)"
            :is-selectable="props.isSelectable"
            :is-selected="props.isItemSelected(entry.itemKey)"
            :on-click="props.row?.(entry.viewModel.row.original)?.onClick ?? null"
            :sub-component="entry.viewModel.subComponent"
            @toggle-expanded="emit('toggleExpanded', entry.itemKey)"
            @toggle-selected="emit('toggleSelected', entry.itemKey)"
          />
        </div>
      </template>

      <div
        v-if="paddingAfterPx > 0"
        :style="{ height: `${paddingAfterPx}px` }"
      />
    </div>
  </div>
</template>
