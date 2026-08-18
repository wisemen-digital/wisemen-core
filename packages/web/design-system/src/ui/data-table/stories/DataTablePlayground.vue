<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { createAction } from '@wisemen/vue-core-actions'
import type { ApiError } from '@wisemen/vue-core-api-utils'
import {
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
import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import type { BadgeColor } from '@/ui/badge/badge.props'
import UIDataTable from '@/ui/data-table/components/DataTable.vue'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import {
  createDataTableAvatarCell,
  createDataTableBadgeCell,
  createDataTableBadgeGroupCell,
  createDataTableBooleanCell,
  createDataTableContactInfoCell,
  createDataTableCurrencyCell,
  createDataTableIdCell,
  createDataTableLocationCell,
  createDataTableLongTextCell,
  createDataTableNumberCell,
  createDataTableTextCell,
  createDataTableTimestampCell,
} from '@/ui/data-table/types/dataTableColumn.type'
import type { DataTableRowConfig } from '@/ui/data-table/types/dataTableRowConfig.type'
import { createDataTableRowActionClick } from '@/ui/data-table/types/dataTableRowConfig.type'
import type { TableSelectionState } from '@/ui/table/types/table.type'

interface User {
  id: string
  startDate: Temporal.Instant
  lastActiveAt: Temporal.Instant
  isVerified: boolean | null
  name: string
  address: Address
  balance: number
  bio: string
  contactName: string
  department: string
  email: string
  manager: string
  phoneNumber: string
  role: string
  status: 'active' | 'inactive'
  tags: {
    color?: BadgeColor
    label: string
  }[]
}

const props = withDefaults(defineProps<{
  // Adds `cellTypeColumns` (Currency, Boolean, LongText, BadgeGroup, ContactInfo, Location) on
  // top of `baseColumns` — used by the `CellTypes` story only.
  hasCellTypes?: boolean
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
  variant?: 'contained' | 'full-page'
}>(), {
  hasCellTypes: false,
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
  variant: 'contained',
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

function onSelect(state: TableSelectionState<User>): void {
  // eslint-disable-next-line no-console
  console.log('[DataTablePlayground] selection changed', state)
}

const selectionActions: Action[] = [
  createAction({
    id: 'delete-selected-users',
    name: () => 'Delete',
    availableWhenUnauthenticated: true,
    execute: () => {
      // eslint-disable-next-line no-console
      console.log('[DataTablePlayground] delete action executed')
    },
    icon: () => Trash01Icon,
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
    onClick: createDataTableRowActionClick(createAction({
      id: `row-click-user-${item.id}`,
      name: () => 'Row click',
      availableWhenUnauthenticated: true,
      execute: () => {
        // eslint-disable-next-line no-console
        console.log('[DataTablePlayground] row clicked', item.id)
      },
    })),
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
const ADDRESSES: Address[] = [
  {
    placeId: 'mock-antwerp',
    bus: '',
    city: 'Antwerp',
    coordinates: {
      lat: 51.2194,
      lng: 4.4025,
    },
    country: 'Belgium',
    postalCode: '2000',
    street: 'Meir',
    streetNumber: '78',
  },
  {
    placeId: 'mock-amsterdam',
    bus: '2',
    city: 'Amsterdam',
    coordinates: {
      lat: 52.3676,
      lng: 4.9041,
    },
    country: 'Netherlands',
    postalCode: '1012',
    street: 'Damrak',
    streetNumber: '1',
  },
  {
    placeId: 'mock-berlin',
    bus: '',
    city: 'Berlin',
    coordinates: {
      lat: 52.52,
      lng: 13.405,
    },
    country: 'Germany',
    postalCode: '10117',
    street: 'Unter den Linden',
    streetNumber: '5',
  },
  {
    placeId: 'mock-lisbon',
    bus: '',
    city: 'Lisbon',
    coordinates: {
      lat: 38.7223,
      lng: -9.1393,
    },
    country: 'Portugal',
    postalCode: '1100',
    street: 'Rua Augusta',
    streetNumber: '12',
  },
]
const BIOS = [
  'Focused on scaling backend infrastructure and mentoring new engineers across the platform team.',
  'Leads go-to-market strategy for the EMEA region, with a background in enterprise SaaS sales.',
  'Passionate about accessible design systems and reducing onboarding friction for new hires.',
  'Handles escalations from key accounts and coordinates cross-team incident response.',
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
]

const now = Temporal.Now.instant()

const data: User[] = Array.from({
  length: 200,
}, (_, i) => ({
  id: String(i + 1),
  startDate: now.subtract({
    hours: (i + 1) * 24 * 30,
  }),
  lastActiveAt: now.subtract({
    hours: i * 3,
  }),
  // `null` for one in five rows — demonstrates the boolean cell's "unknown" state (no icon).
  isVerified: i % 5 === 4 ? null : i % 2 === 0,
  name: `User ${i + 1}`,
  address: ADDRESSES[i % ADDRESSES.length]!,
  balance: (i % 17) * 1234.56,
  bio: BIOS[i % BIOS.length]!,
  contactName: CONTACT_NAMES[i % CONTACT_NAMES.length]!,
  department: DEPARTMENTS[i % DEPARTMENTS.length]!,
  email: `user${i + 1}@example.com`,
  manager: `Manager ${(i % 12) + 1}`,
  phoneNumber: `+32 4${String(70 + (i % 20)).padStart(2, '0')} ${String(100_000 + i).slice(-6)}`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),
  // `% 3`, not `% 4` — `DEPARTMENTS.length` is 4, and a same-period modulus would make status
  // perfectly correlate with department (every department landing on exactly one status value),
  // leaving only a single subgroup per department under `department+status` two-level grouping.
  status: i % 3 === 0 ? 'inactive' : 'active',
  tags: [
    {
      color: 'blue',
      label: DEPARTMENTS[i % DEPARTMENTS.length]!,
    },
    {
      color: i % 2 === 0 ? 'success' : 'gray',
      label: i % 2 === 0 ? 'Full-time' : 'Contractor',
    },
    {
      label: `Cohort ${(i % 5) + 1}`,
    },
  ],
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
  createDataTableAvatarCell({
    headerLabel: 'Contact',
    key: 'contact',
    value: (item) => ({
      label: item.contactName,
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

// Showcases every predefined cell type together — see the `CellTypes` story. Kept separate from
// `baseColumns` (used by every other story) so the rest of the stories' column counts/order stay
// unaffected by this batch's additions.
const cellTypeColumns: DataTableColumn<User>[] = [
  createDataTableCurrencyCell({
    headerLabel: 'Balance (currency)',
    key: 'balanceCurrency',
    value: (item) => ({
      currency: 'EUR',
      fallback: '—',
      value: item.balance,
    }),
  }),
  createDataTableBooleanCell({
    headerLabel: 'Verified',
    key: 'isVerified',
    value: (item) => ({
      label: item.isVerified ? 'Verified' : 'Not verified',
      value: item.isVerified,
    }),
  }),
  createDataTableLongTextCell({
    headerLabel: 'Bio',
    key: 'bio',
    value: (item) => ({
      value: item.bio,
    }),
  }),
  createDataTableBadgeGroupCell({
    headerLabel: 'Tags',
    key: 'tags',
    value: (item) => ({
      badges: item.tags,
      maxVisible: 2,
    }),
  }),
  createDataTableContactInfoCell({
    headerLabel: 'Contact info',
    key: 'contactInfo',
    value: (item) => ({
      email: item.email,
      phoneNumber: item.phoneNumber,
      website: 'https://example.com',
    }),
  }),
  createDataTableLocationCell({
    headerLabel: 'Location',
    key: 'location',
    value: (item) => ({
      precision: 'municipality',
      value: item.address,
    }),
  }),
]

const columns = computed<DataTableColumn<User>[]>(() => [
  ...baseColumns,
  ...(props.hasCellTypes ? cellTypeColumns : []),
].map((column) => ({
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
        }, item.address.city),
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
      :variant="props.variant"
      class="min-h-0 flex-1"
      @select="onSelect"
    />
  </div>
</template>
