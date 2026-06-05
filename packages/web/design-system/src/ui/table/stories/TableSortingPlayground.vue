<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  markRaw,
} from 'vue'

import { useSort } from '@/composables/sort.composable'
import UITable from '@/ui/table/components/Table.vue'
import UITableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import UITableBodyRowCellText from '@/ui/table/components/TableBodyRowCellText.vue'
import type { TableColumn } from '@/ui/table/types/table.type'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const props = withDefaults(defineProps<{
  variant?: 'contained' | 'full-page'
}>(), {
  variant: 'full-page',
})

const rawData: User[] = Array.from({
  length: 20,
}, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),
  status: i % 4 === 0 ? 'inactive' : 'active',
}))

type UserKey = keyof Omit<User, 'id'>

const sort = useSort<UserKey>({
  keys: [
    'name',
    'email',
    'role',
    'status',
  ],
})

const data = computed<User[]>(() => {
  const [
    activeSort,
  ] = sort.values.value

  if (activeSort === undefined) {
    return rawData
  }

  return rawData.toSorted((a, b) => {
    const aVal = String(a[activeSort.key])
    const bVal = String(b[activeSort.key])
    const comparison = aVal.localeCompare(bVal)

    return activeSort.direction === 'asc' ? comparison : -comparison
  })
})

function makeCellComponent(item: User, key: keyof User, isPrimary = false) {
  return markRaw(defineComponent({
    name: `Cell_${key}`,
    setup() {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      return () => h(UITableBodyRowCell, null, {
        default: () => h(UITableBodyRowCellText, {
          isPrimaryCell: isPrimary,
          text: String(item[key]),
        }),
      })
    },
  }))
}

const columns: TableColumn<User>[] = [
  {
    headerLabel: 'Name',
    key: 'name',
    component: (item) => makeCellComponent(item, 'name', true),
  },
  {
    headerLabel: 'Email',
    key: 'email',
    component: (item) => makeCellComponent(item, 'email'),
  },
  {
    headerLabel: 'Role',
    key: 'role',
    component: (item) => makeCellComponent(item, 'role'),
  },
  {
    headerLabel: 'Status',
    key: 'status',
    component: (item) => makeCellComponent(item, 'status'),
  },
]
</script>

<template>
  <div class="h-150">
    <UITable
      :columns="columns"
      :data="data"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="false"
      :sort="sort"
      :variant="props.variant"
    />
  </div>
</template>
