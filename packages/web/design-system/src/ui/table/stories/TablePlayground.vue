<script setup lang="ts">
import {
  defineComponent,
  h,
  markRaw,
} from 'vue'

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
  hasActiveSearch?: boolean
  isLoading?: boolean
  activeFilterCount?: number
  disableColumnResize?: boolean
  variant?: 'contained' | 'full-page'
}>(), {
  hasActiveSearch: false,
  isLoading: false,
  activeFilterCount: 0,
  disableColumnResize: false,
  variant: 'full-page',
})

const data: User[] = Array.from({
  length: 50,
}, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),
  status: i % 4 === 0 ? 'inactive' : 'active',
}))

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
    headerDescription: 'This name represents the user his first name',
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
      :data="props.isLoading ? [] : data"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="props.isLoading"
      :variant="props.variant"
      :has-active-search="props.hasActiveSearch"
      :active-filter-count="props.activeFilterCount"
      :disable-column-resize="props.disableColumnResize"
    />
  </div>
</template>
