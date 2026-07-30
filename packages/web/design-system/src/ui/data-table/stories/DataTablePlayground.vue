<script setup lang="ts">
import type {
  Action,
  ActionModel,
} from '@wisemen/vue-core-actions'
import { createAction } from '@wisemen/vue-core-actions'
import { Trash01Icon } from '@wisemen/vue-core-icons'
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  defineComponent,
  h,
  markRaw,
} from 'vue'

import { useSort } from '@/composables/sort.composable'
import UIDataTable from '@/ui/data-table/components/DataTable.vue'
import type { DataTableMobileCardConfig } from '@/ui/data-table/types/dataTable.props'
import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import type { TableSelectionState } from '@/ui/table/types/table.type'

interface User {
  id: string
  startDate: Temporal.Instant
  lastActiveAt: Temporal.Instant
  name: string
  balance: number
  department: string
  email: string
  location: string
  manager: string
  phoneNumber: string
  role: string
  status: 'active' | 'inactive'
}

const props = withDefaults(defineProps<{
  hasSubComponent?: boolean
  isFirstColumnSticky?: boolean
  isLastColumnSticky?: boolean
  isNarrow?: boolean
  isSelectable?: boolean
  groupBy?: 'department' | 'department+status' | 'status' | null
}>(), {
  hasSubComponent: false,
  isFirstColumnSticky: false,
  isLastColumnSticky: false,
  isNarrow: false,
  isSelectable: false,
  groupBy: null,
})

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

function getActionModel(item: User): ActionModel {
  return {
    key: item.id,
    modelName: 'user',
  }
}

function getLink(item: User) {
  return {
    path: `/users/${item.id}`,
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
  name: `User ${i + 1}`,
  balance: (i % 17) * 1234.56,
  department: DEPARTMENTS[i % DEPARTMENTS.length]!,
  email: `user${i + 1}@example.com`,
  location: LOCATIONS[i % LOCATIONS.length]!,
  manager: `Manager ${(i % 12) + 1}`,
  phoneNumber: `+32 4${String(70 + (i % 20)).padStart(2, '0')} ${String(100_000 + i).slice(-6)}`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),
  status: i % 4 === 0 ? 'inactive' : 'active',
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

const columns: DataTableColumn<User>[] = [
  {
    cell: (item) => ({
      type: 'text',
      value: item.name,
    }),
    headerLabel: 'Name',
    key: 'name',
  },
  {
    cell: (item) => ({
      maxLength: 10,
      type: 'id',
      value: `usr_${item.id.padStart(8, '0')}`,
    }),
    headerLabel: 'ID',
    key: 'id',
  },
  {
    cell: (item) => ({
      color: item.status === 'active' ? 'success' : 'gray',
      label: item.status === 'active' ? 'Active' : 'Inactive',
      type: 'badge',
      variant: 'translucent',
    }),
    headerLabel: 'Status',
    key: 'status',
  },
  {
    cell: (item) => ({
      fallback: '—',
      formatOptions: {
        currency: 'EUR',
        style: 'currency',
      },
      type: 'number',
      value: item.balance,
    }),
    headerLabel: 'Balance',
    key: 'balance',
  },
  {
    cell: (item) => ({
      type: 'text',
      value: item.department,
    }),
    headerLabel: 'Department',
    key: 'department',
  },
  {
    cell: (item) => ({
      isRelative: true,
      type: 'timestamp',
      value: item.lastActiveAt,
    }),
    headerLabel: 'Last active',
    key: 'lastActiveAt',
  },
  {
    cell: (item) => ({
      granularity: 'day',
      type: 'timestamp',
      value: item.startDate,
    }),
    headerLabel: 'Start date',
    key: 'startDate',
  },
  {
    cell: (item) => ({
      email: item.email,
      phoneNumber: item.phoneNumber,
      type: 'contactInfo',
    }),
    headerLabel: 'Contact',
    key: 'contact',
  },
  {
    cell: (item) => ({
      type: 'text',
      value: item.manager,
    }),
    headerLabel: 'Manager',
    key: 'manager',
  },
]

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
      :data="sortedData"
      :get-action-model="getActionModel"
      :get-key="(item) => item.id"
      :get-link="getLink"
      :group-by="groupByProp"
      :is-first-column-sticky="props.isFirstColumnSticky"
      :is-initialized="true"
      :is-last-column-sticky="props.isLastColumnSticky"
      :is-selectable="props.isSelectable"
      :mobile-card="mobileCard"
      :selection-actions="selectionActions"
      :sort="sort"
      :sub-component="props.hasSubComponent ? subComponent : null"
      class="min-h-0 flex-1"
      @select="onSelect"
    />
  </div>
</template>
