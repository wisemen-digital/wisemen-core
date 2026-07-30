<script setup lang="ts" generic="TItem">
import { computed } from 'vue'

import type { RegisteredRouteLocationRaw } from '@/register'
import DataTableCellRenderer from '@/ui/data-table/components/DataTableCellRenderer.vue'
import DataTableMobileCard from '@/ui/data-table/components/DataTableMobileCard.vue'
import DataTableMobileGroupHeader from '@/ui/data-table/components/DataTableMobileGroupHeader.vue'
import { useDataTableMobileSlots } from '@/ui/data-table/composables/dataTableMobileSlots.composable'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowViewModel } from '@/ui/data-table/types/dataTableRowViewModel.type'

const props = withDefaults(defineProps<{
  isItemSelected: (key: string) => boolean
  isSelectable?: boolean
  columns: DataTableColumn<TItem>[]
  expandedItemKeys: Set<string>
  getKey: (item: TItem) => string
  getLink?: ((item: TItem) => RegisteredRouteLocationRaw | null) | null
  mobileCard: DataTableMobileCardConfig | null
  rowViewModels: DataTableRowViewModel<TItem>[]
}>(), {
  isSelectable: false,
  getLink: null,
})

const emit = defineEmits<{
  toggleExpanded: [key: string]
  toggleGroupSelected: [items: TItem[]]
  toggleSelected: [key: string]
}>()

const {
  getMobileSlots,
} = useDataTableMobileSlots(computed(() => props.columns), computed(() => props.mobileCard))
</script>

<template>
  <div role="table">
    <template
      v-for="viewModel of props.rowViewModels"
      :key="viewModel.row.id"
    >
      <DataTableMobileGroupHeader
        v-if="viewModel.isGrouped"
        :depth="viewModel.row.depth"
        :is-expanded="viewModel.row.getIsExpanded()"
        :is-selectable="props.isSelectable"
        :is-selected="viewModel.isGroupAllSelected"
        :is-selected-indeterminate="viewModel.isGroupIndeterminate && !viewModel.isGroupAllSelected"
        :label="viewModel.groupLabelCell === null ? viewModel.groupLabel : ''"
        @toggle="viewModel.row.toggleExpanded()"
        @toggle-selected="emit('toggleGroupSelected', viewModel.row.getLeafRows().map((leafRow) => leafRow.original))"
      >
        <DataTableCellRenderer
          v-if="viewModel.groupLabelCell !== null"
          :cell="viewModel.groupLabelCell"
        />
      </DataTableMobileGroupHeader>

      <DataTableMobileCard
        v-else
        v-bind="getMobileSlots(viewModel.row.original)"
        :is-expanded="props.expandedItemKeys.has(props.getKey(viewModel.row.original))"
        :is-selectable="props.isSelectable"
        :is-selected="props.isItemSelected(props.getKey(viewModel.row.original))"
        :link="props.getLink?.(viewModel.row.original) ?? null"
        @toggle-expanded="emit('toggleExpanded', props.getKey(viewModel.row.original))"
        @toggle-selected="emit('toggleSelected', props.getKey(viewModel.row.original))"
      />
    </template>
  </div>
</template>
