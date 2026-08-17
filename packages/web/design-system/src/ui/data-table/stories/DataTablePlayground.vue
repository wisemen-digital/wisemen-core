<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { createAction } from '@wisemen/vue-core-actions'
import type { ApiError } from '@wisemen/vue-core-api-utils'
import {
  Copy01Icon,
  EyeIcon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  defineComponent,
  h,
  markRaw,
  shallowRef,
} from 'vue'

import { useSort } from '@/composables/sort.composable'
import UIDataTable from '@/ui/data-table/components/DataTable.vue'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import {
  createDataTableBadgeCell,
  createDataTableIdCell,
  createDataTableNumberCell,
  createDataTablePersonCell,
  createDataTableTextCell,
  createDataTableTimestampCell,
} from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'

interface User {
  id: string
  startDate: Temporal.Instant
  lastActiveAt: Temporal.Instant
  name: string
  balance: number
  contactName: string
  department: string
  location: string
  manager: string
  phoneNumber: string
  role: string
  status: 'active' | 'inactive'
}

const props = withDefaults(defineProps<{
  hasRowActions?: boolean
  hasSubComponent?: boolean
  isFirstColumnSticky?: boolean
  // Simulates an always-loading table with no data yet — see `isSimulatingInfiniteScroll` for
  // the interactive next-page-fetch demo instead.
  isForcedLoading?: boolean
  isLastColumnSticky?: boolean
  isNarrow?: boolean
  isSelectable?: boolean
  // Forces the empty state regardless of the mock dataset.
  isSimulatingEmpty?: boolean
  // Forces the error state regardless of loading/data.
  isSimulatingError?: boolean
  // When `true`, `data` starts truncated to a small page and `onNextPage` reveals more of the
  // 200-item mock dataset on a short delay, simulating a real paginated fetch — exercises
  // `onNextPage`/`isFetchingNextPage` end to end instead of just their static visual states.
  isSimulatingInfiniteScroll?: boolean
  groupBy?: 'department' | 'department+status' | 'status' | null
  // Pins the named columns left/right by key (`DataTableColumn.isSticky`), independent of
  // `isFirstColumnSticky`/`isLastColumnSticky` — demonstrates any combination of columns
  // sticking together as one contiguous region per side, with cumulative offsets, not just a
  // single pinned column. A key present in both arrays is a misuse of the control, not a
  // supported combination — `columns` below resolves `left` first, so it would silently pin
  // left; pick one side per column key.
  stickyLeftColumnKeys?: string[]
  stickyRightColumnKeys?: string[]
}>(), {
  hasRowActions: false,
  hasSubComponent: false,
  isFirstColumnSticky: false,
  isForcedLoading: false,
  isLastColumnSticky: false,
  isNarrow: false,
  isSelectable: false,
  isSimulatingEmpty: false,
  isSimulatingError: false,
  isSimulatingInfiniteScroll: false,
  groupBy: null,
  stickyLeftColumnKeys: () => [],
  stickyRightColumnKeys: () => [],
})

function getStickySide(columnKey: string): 'left' | 'right' | undefined {
  if (props.stickyLeftColumnKeys.includes(columnKey)) {
    return 'left'
  }

  if (props.stickyRightColumnKeys.includes(columnKey)) {
    return 'right'
  }

  return undefined
}

const selectionActions: Action[] = [
  createAction({
    id: 'duplicate-selected-users',
    name: () => 'Duplicate',
    availableWhenUnauthenticated: true,
    execute: (ctx) => {
      if (ctx.tableSelection?.type === 'include') {
        // eslint-disable-next-line no-console
        console.log('Duplicate items:', ctx.tableSelection.items)
      }
      else {
        // eslint-disable-next-line no-console
        console.log('Duplicate items except:', ctx.tableSelection?.items)
      }

      ctx.clearTableSelection()
    },
    icon: () => Copy01Icon,
    keyboardShortcut: {
      key: 'D',
    },
  }),
  createAction({
    id: 'delete-selected-users',
    name: () => 'Delete',
    availableWhenUnauthenticated: true,
    execute: (ctx) => {
      if (ctx.tableSelection?.type === 'include') {
        // eslint-disable-next-line no-console
        console.log('Delete items:', ctx.tableSelection.items)
      }
      else {
        // eslint-disable-next-line no-console
        console.log('Delete items except:', ctx.tableSelection?.items)
      }

      ctx.clearTableSelection()
    },
    icon: () => Trash01Icon,
    keyboardShortcut: {
      key: 'Backspace',
    },
  }),
]

function row(item: User): DataTableRowConfig {
  return {
    actions: {
      inline: [
        createAction({
          id: `view-user-${item.id}`,
          name: () => 'View',
          availableWhenUnauthenticated: true,
          execute: () => {
            // eslint-disable-next-line no-console
            console.log('[DataTablePlayground] view action executed', item.id)
          },
          icon: () => EyeIcon,
        }),
      ],
      more: [
        createAction({
          id: `delete-user-${item.id}`,
          name: () => 'Delete',
          availableWhenUnauthenticated: true,
          execute: () => {
            // eslint-disable-next-line no-console
            console.log('[DataTablePlayground] delete action executed', item.id)
          },
          icon: () => Trash01Icon,
        }),
      ],
    },
    model: {
      key: item.id,
      modelName: 'user',
    },
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log('[DataTablePlayground] row clicked', item.id)
    },
  }
}

const groupByProp = computed<string | [string, string] | null>(() => {
  if (props.groupBy === 'department+status') {
    return [
      'department',
      'status',
    ]
  }

  return props.groupBy
})

const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Support',
]
const LOCATIONS = [
  'Antwerp, Belgium',
  'Amsterdam, Netherlands',
  'Berlin, Germany',
  'Lisbon, Portugal',
]
// Real-looking names, unlike the `User N` values the `Name` column sorts on — the person cell's
// avatar derives its initials and color from the name, and `User N` would render every avatar
// as a meaningless `U`.
const CONTACT_NAMES = [
  'Amelie Dubois',
  'Bram Peeters',
  'Chiara Rossi',
  'Daan Vermeulen',
  'Elena Novak',
  'Felix Hartmann',
  'Greta Lindqvist',
  'Hugo Martins',
  'Demetrius Brown',
  'Dyandre',
  'Shaniqua Black',
]

const now = Temporal.Now.instant()

const data: User[] = Array.from({
  length: 200,
}, (_, i) => ({
  id: `id-${String(i + 1)}`,
  startDate: now.subtract({
    hours: (i + 1) * 24 * 30,
  }),
  lastActiveAt: now.subtract({
    hours: i * 3,
  }),
  name: `User ${i + 1}`,
  balance: (i % 17) * 1234.56,
  contactName: CONTACT_NAMES[i % CONTACT_NAMES.length]!,
  department: DEPARTMENTS[i % DEPARTMENTS.length]!,
  location: LOCATIONS[i % LOCATIONS.length]!,
  manager: `Manager ${(i % 12) + 1}`,
  phoneNumber: `+32 4${String(70 + (i % 20)).padStart(2, '0')} ${String(100_000 + i).slice(-6)}`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),
  // `% 3`, not `% 4` — `DEPARTMENTS.length` is 4, and a same-period modulus would make status
  // perfectly correlate with department (every department landing on exactly one status value),
  // leaving only a single subgroup per department under `department+status` two-level grouping.
  status: i % 3 === 0 ? 'inactive' : 'active',
}))

const sort = useSort<'name' | 'role' | 'status'>({
  keys: [
    'name',
    'role',
    'status',
  ],
})

const sortedData = computed<User[]>(() => {
  const activeSort = sort.values.value[0]

  if (activeSort === undefined) {
    return data
  }

  const direction = activeSort.direction === 'asc' ? 1 : -1

  return data.toSorted((a, b) => direction * String(a[activeSort.key]).localeCompare(String(b[activeSort.key])))
})

const INFINITE_SCROLL_PAGE_SIZE = 30
const INFINITE_SCROLL_FETCH_DELAY_MS = 600

const loadedCount = shallowRef<number>(INFINITE_SCROLL_PAGE_SIZE)
const isFetchingNextPage = shallowRef<boolean>(false)

const visibleData = computed<User[]>(() => {
  if (props.isSimulatingEmpty) {
    return []
  }

  return props.isSimulatingInfiniteScroll ? sortedData.value.slice(0, loadedCount.value) : sortedData.value
})

const error = computed<ApiError | null>(() => (props.isSimulatingError ? new Error('Failed to load users.') : null))

function onNextPage(): void {
  if (
    !props.isSimulatingInfiniteScroll
    || isFetchingNextPage.value
    || loadedCount.value >= sortedData.value.length
  ) {
    return
  }

  isFetchingNextPage.value = true

  setTimeout(() => {
    loadedCount.value = Math.min(loadedCount.value + INFINITE_SCROLL_PAGE_SIZE, sortedData.value.length)
    isFetchingNextPage.value = false
  }, INFINITE_SCROLL_FETCH_DELAY_MS)
}

// Sticky side (if any) is applied after the fact, keyed off each column's own `key` — see
// `getStickySide` — rather than passed inline per factory call, so the Storybook "pinned
// left"/"pinned right" controls apply to any column by key without editing this list.
// Declared as its own typed array (not inline in the `computed` below) so each
// `createDataTableXCell` call still infers its `value` callback's `item` type from `User`
// independently — folding this straight into a trailing `.map()` loses that per-call inference.
const baseColumns: DataTableColumn<User>[] = [
  createDataTableTextCell({
    headerLabel: 'Name',
    key: 'name',
    value: (item) => ({
      value: item.name,
    }),
  }),
  createDataTableIdCell({
    headerLabel: 'ID',
    key: 'id',
    value: (item) => ({
      maxLength: 10,
      value: `usr_${item.id.padStart(8, '0')}`,
    }),
  }),
  createDataTableBadgeCell({
    headerLabel: 'Status',
    key: 'status',
    value: (item) => ({
      color: item.status === 'active' ? 'success' : 'gray',
      label: item.status === 'active' ? 'Active' : 'Inactive',
      variant: 'translucent',
    }),
  }),
  createDataTableNumberCell({
    headerLabel: 'Balance',
    key: 'balance',
    value: (item) => ({
      fallback: '—',
      formatOptions: {
        currency: 'EUR',
        style: 'currency',
      },
      value: item.balance,
    }),
  }),
  createDataTableTextCell({
    headerLabel: 'Department',
    key: 'department',
    value: (item) => ({
      value: item.department,
    }),
  }),
  createDataTableTimestampCell({
    headerLabel: 'Last active',
    key: 'lastActiveAt',
    value: (item) => ({
      isRelative: true,
      value: item.lastActiveAt,
    }),
  }),
  createDataTableTimestampCell({
    headerLabel: 'Start date',
    key: 'startDate',
    value: (item) => ({
      granularity: 'day',
      value: item.startDate,
    }),
  }),
  createDataTablePersonCell({
    headerLabel: 'Contact',
    key: 'contact',
    value: (item) => ({
      name: item.contactName,
      supportingText: item.phoneNumber,
    }),
  }),
  createDataTableTextCell({
    headerLabel: 'Manager',
    key: 'manager',
    value: (item) => ({
      value: item.manager,
    }),
  }),
]

const columns = computed<DataTableColumn<User>[]>(() => baseColumns.map((column) => ({
  ...column,
  isSticky: getStickySide(column.key),
})))

const mobileCard: DataTableMobileCardConfig = {
  indicator: 'status',
  primary: 'name',
  secondary: 'department',
  meta: 'balance',
}

function makeSubComponent(item: User) {
  return markRaw(defineComponent({
    name: `SubComponent_${item.id}`,
    setup() {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      return () => h('dl', {
        class: 'grid grid-cols-[max-content_1fr] gap-x-lg gap-y-xs text-xs',
      }, [
        h('dt', {
          class: 'text-tertiary',
        }, 'Manager'),
        h('dd', {
          class: 'text-primary',
        }, item.manager),
        h('dt', {
          class: 'text-tertiary',
        }, 'Location'),
        h('dd', {
          class: 'text-primary',
        }, item.location),
        h('dt', {
          class: 'text-tertiary',
        }, 'Phone'),
        h('dd', {
          class: 'text-primary',
        }, item.phoneNumber),
      ])
    },
  }))
}

function subComponent(item: User) {
  return props.hasSubComponent && item.status === 'active' ? makeSubComponent(item) : null
}
</script>

<template>
  <div
    :class="props.isNarrow ? 'w-96' : 'w-240'"
    class="flex h-150 max-w-full min-w-0 flex-col"
  >
    <UIDataTable
      :columns="columns"
      :data="visibleData"
      :error="error"
      :get-key="(item) => item.id"
      :group-by="groupByProp"
      :is-fetching-next-page="isFetchingNextPage"
      :is-first-column-sticky="props.isFirstColumnSticky"
      :is-last-column-sticky="props.isLastColumnSticky"
      :is-loading="props.isForcedLoading"
      :is-selectable="props.isSelectable"
      :mobile-card="mobileCard"
      :on-next-page="props.isSimulatingInfiniteScroll ? onNextPage : null"
      :row="props.hasRowActions ? row : null"
      :selection-actions="selectionActions"
      :sort="sort"
      :sub-component="props.hasSubComponent ? subComponent : null"
      :total-count="props.isSimulatingInfiniteScroll ? sortedData.length : null"
      class="min-h-0 flex-1"
    />
  </div>
</template>
