<script setup lang="ts" generic="TTableData extends TableData<unknown>">
import type { ApiError } from '@wisemen/vue-core-api-utils'
import {
  computed,
  shallowRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIEmptyState } from '@/ui/empty-state/index'
import TableBody from '@/ui/table/components/TableBody.vue'
import TableBodyGroup from '@/ui/table/components/TableBodyGroup.vue'
import TableBodyRow from '@/ui/table/components/TableBodyRow.vue'
import TableBodySubGroup from '@/ui/table/components/TableBodySubGroup.vue'
import TableHeader from '@/ui/table/components/TableHeader.vue'
import TableHeaderCell from '@/ui/table/components/TableHeaderCell.vue'
import TableHiddenResultsWarning from '@/ui/table/components/TableHiddenResultsWarning.vue'
import TableLoading from '@/ui/table/components/TableLoading.vue'
import TableRoot from '@/ui/table/components/TableRoot.vue'
import TableScrollContainer from '@/ui/table/components/TableScrollContainer.vue'
import { useTableVirtualScroller } from '@/ui/table/composables/tableVirtualScroller.composable'
import { useProvideTableScrollContainerContext } from '@/ui/table/context/tableScrollContainer.context'
import type { TableProps } from '@/ui/table/types/table.props'
import type {
  InferTableItem,
  TableColumnSize,
  TableData,
  TableGroupedData,
  TableSubGroupedData,
} from '@/ui/table/types/table.type'

type TItem = InferTableItem<TTableData>

const props = withDefaults(defineProps<TableProps<TTableData>>(), {
  activeFilterCount: 0,
})

const emit = defineEmits<{
  clearFilters: []
  clearSearch: []
}>()

const i18n = useI18n()

const scrollContainerEl = shallowRef<HTMLElement | null>(null)

useProvideTableScrollContainerContext(scrollContainerEl)

const dataMode = computed<'flat' | 'grouped' | 'with-sub-groups'>(() => {
  if (props.data.length === 0) {
    return 'flat'
  }

  const first = props.data[0] as object

  if ('subGroups' in first) {
    return 'with-sub-groups'
  }

  if ('items' in first) {
    return 'grouped'
  }

  return 'flat'
})

const flatItems = computed<TItem[]>(
  () => props.data as unknown as TItem[],
)
const groupedItems = computed<TableGroupedData<TItem>[]>(
  () => props.data as unknown as TableGroupedData<TItem>[],
)
const subGroupedItems = computed<TableSubGroupedData<TItem>[]>(
  () => props.data as unknown as TableSubGroupedData<TItem>[],
)

const columnSizes = computed<TableColumnSize[]>(() => (
  props.columns.map((column) => column.size ?? {
    max: '15rem',
    min: 'min-content',
  })
))

const {
  paddingAfterPx: paddingAfter,
  paddingBeforePx: paddingBefore,
  virtualItems: virtualRows,
} = useTableVirtualScroller(
  computed(() => (dataMode.value === 'flat' ? flatItems.value.length : 0)),
  scrollContainerEl,
)

watch(() => props.data.length, (length, oldLength) => {
  if (length < oldLength) {
    scrollContainerEl.value?.scrollTo({
      top: 0,
    })
  }
})

function onClearFiltersAndSearch(): void {
  emit('clearFilters')
  emit('clearSearch')
}
</script>

<template>
  <TableRoot
    :column-sizes="columnSizes"
    :actions="props.actions"
    :active-filter-count="props.activeFilterCount"
    :has-active-search="props.hasActiveSearch"
    :on-next-page="props.onNextPage"
    :is-initialized="props.data.length > 0"
    :header-actions="props.headerActions"
    :action-group="props.actionGroup"
    :disable-column-resize="props.disableColumnResize"
    :variant="props.variant"
    @clear-filters-and-search="onClearFiltersAndSearch"
  >
    <TableScrollContainer :disable-scroll="props.data.length === 0">
      <TableHeader v-if="data.length > 0 || props.isLoading">
        <TableHeaderCell
          v-for="(column, columnIndex) of props.columns"
          :key="column.key"
          :column-index="columnIndex"
          :is-resizable="columnIndex < props.columns.length - 1"
          :label="column.headerLabel"
          :center-content="column.centerHeaderContent ?? false"
          :action-config="column.actionConfig"
        />
      </TableHeader>

      <TableBody>
        <template v-if="dataMode === 'flat'">
          <div
            v-if="paddingBefore > 0"
            :style="{ height: `${paddingBefore}px` }"
            class="col-span-full"
          />

          <TableBodyRow
            v-for="row of virtualRows"
            :key="props.getKey(flatItems[row.index]!)"
            :action-model="props.getActionModel?.(flatItems[row.index]!)"
          >
            <Component
              :is="column.component(flatItems[row.index]! as any)"
              v-for="column of props.columns"
              :key="column.key"
            />
          </TableBodyRow>

          <div
            v-if="paddingAfter > 0"
            :style="{ height: `${paddingAfter}px` }"
            class="col-span-full"
          />
        </template>

        <template v-else-if="dataMode === 'with-sub-groups'">
          <TableBodyGroup
            v-for="group of subGroupedItems"
            :key="group.key"
            :default-open="group.defaultOpen"
            :label="group.label"
          >
            <TableBodySubGroup
              v-for="subGroup of group.subGroups"
              :key="subGroup.key"
              :default-open="subGroup.defaultOpen"
              :label="subGroup.label"
            >
              <TableBodyRow
                v-for="item of subGroup.items"
                :key="props.getKey(item)"
                :action-model="props.getActionModel?.(item)"
              >
                <Component
                  :is="column.component(item as any)"
                  v-for="column of props.columns"
                  :key="column.key"
                />
              </TableBodyRow>
            </TableBodySubGroup>
          </TableBodyGroup>
        </template>

        <template v-else>
          <TableBodyGroup
            v-for="group of groupedItems"
            :key="group.key"
            :default-open="group.defaultOpen"
            :label="group.label"
            :header-cells="props.groupHeaderCells?.(group)"
          >
            <TableBodyRow
              v-for="item of group.items"
              :key="props.getKey(item)"
              :action-model="props.getActionModel?.(item)"
            >
              <Component
                :is="column.component(item as any)"
                v-for="column of props.columns"
                :key="column.key"
              />
            </TableBodyRow>
          </TableBodyGroup>
        </template>
      </TableBody>

      <template #outside-grid>
        <TableLoading v-if="props.isLoading || props.isFetchingNextPage" />
        <TableHiddenResultsWarning v-if="data.length > 0" />
      </template>
    </TableScrollContainer>

    <slot
      v-if="props.error !== null"
      :error="(props.error as ApiError)"
      name="error"
    />

    <template v-else-if="props.data.length === 0 && !props.isLoading">
      <UIEmptyState
        v-if="props.activeFilterCount > 0 || props.hasActiveSearch"
        :secondary-action="{
          type: 'button',
          label: i18n.t('component.table.empty_state.no_results.clear_filters_label'),
          onClick: onClearFiltersAndSearch,
        }"
        :title="i18n.t('component.table.empty_state.no_results.title')"
        :description="i18n.t('component.table.empty_state.no_results.description')"
        illustration="cloud-search"
        class="mx-auto h-full max-w-96 py-xl"
      />

      <UIEmptyState
        v-else
        :title="i18n.t('component.table.empty_state.no_data.title')"
        :description="i18n.t('component.table.empty_state.no_data.description')"
        illustration="cloud-search"
        class="mx-auto h-full max-w-96 py-xl"
      />
    </template>
  </TableRoot>
</template>
