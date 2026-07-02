<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import {
  computed,
  ref,
} from 'vue'

import { useTableColumnWidths } from '@/ui/table/composables/tableColumnWidths.composable'
import { useTableScrollState } from '@/ui/table/composables/tableScrollState.composable'
import { useProvideTableContext } from '@/ui/table/context/table.context'
import type { TableRootProps } from '@/ui/table/types/tableRoot.props'

const props = withDefaults(defineProps<TableRootProps>(), {
  hasActiveSearch: false,
  isSelectable: false,
  actionGroup: null,
  actions: () => [],
  activeFilterCount: 0,
  headerActions: () => [],
  sort: null,
  variant: 'full-page',
})

const emit = defineEmits<{
  clearFiltersAndSearch: []
}>()

const scrollContainerEl = ref<HTMLElement | null>(null)

const {
  isScrollableVertically,
  isScrolledFromLeft,
  isScrolledToEnd,
  setScrollContainer: setScrollContainerScrollState,
} = useTableScrollState()

const registeredGroupCount = ref<number>(0)
const isGroupingEnabled = computed<boolean>(() => registeredGroupCount.value > 0)

const gridEl = computed<HTMLElement | null>(
  () => (scrollContainerEl.value?.children[0] ?? null) as HTMLElement | null,
)

const isColumnResizeDisabled = computed<boolean>(() => props.isColumnResizeDisabled === true || props.disableColumnResize === true)

const {
  isResizing,
  autoFitColumnsAction,
  fitColumnToContent,
  gridTemplateColumns,
  startColumnResize,
} = useTableColumnWidths(
  computed(() => props.columnSizes),
  gridEl,
  computed(() => props.isInitialized),
  computed(() => props.actionGroup),
  isColumnResizeDisabled,
  computed(() => props.isSelectable),
  computed(() => props.hasActiveSearch ?? false),
  computed(() => props.activeFilterCount ?? 0),
)

const activeFilterCountIncludingSearch = computed<number>(
  () => (props.activeFilterCount ?? 0) + (props.hasActiveSearch ? 1 : 0),
)

function registerGroup(): void {
  registeredGroupCount.value += 1
}

function unregisterGroup(): void {
  registeredGroupCount.value -= 1
}

function onClearFiltersAndSearch(): void {
  emit('clearFiltersAndSearch')
}

useInfiniteScroll(scrollContainerEl, () => {
  props.onNextPage?.()
}, {
  offset: {
    bottom: 400,
  },
})

useProvideTableContext({
  isColumnResizeDisabled: computed(() => props.isColumnResizeDisabled),
  isGroupingEnabled: computed(() => isGroupingEnabled.value),
  isResizingColumn: isResizing,
  isScrollableVertically: computed(() => isScrollableVertically.value),
  isScrolledFromLeft: computed(() => isScrolledFromLeft.value),
  isScrolledToEnd: computed(() => isScrolledToEnd.value),
  isSelectable: computed(() => props.isSelectable),
  actions: computed(() => props.actions),
  activeFilterCountIncludingSearch,
  gridTemplateColumns,
  headerActions: computed(() => [
    ...props.headerActions,
    autoFitColumnsAction,
  ]),
  registerGroup,
  setScrollContainer: (el) => {
    scrollContainerEl.value = el
    setScrollContainerScrollState(el)
  },
  sort: props.sort,
  unregisterGroup,
  variant: computed(() => props.variant),
  onClearFiltersAndSearch,
  onColumnResizeFitToContent: fitColumnToContent,
  onColumnResizeStart: startColumnResize,
})
</script>

<template>
  <slot />
</template>

<style>
@keyframes table-collapsible-up {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
    opacity: 0;
    transform: translateY(-0.25rem);
  }
}
@keyframes table-collapsible-down {
  from {
    height: 0;
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}
</style>
