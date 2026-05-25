<script setup lang="ts">
import {
  defineComponent,
  h,
  markRaw,
} from 'vue'

import UITable from '@/ui/table/components/Table.vue'
import UITableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import UITableBodyRowCellText from '@/ui/table/components/TableBodyRowCellText.vue'
import type {
  TableColumn,
  TableGroupedData,
} from '@/ui/table/types/table.type'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function makeCellComponent(item: User, key: keyof User, isPrimary = false) {
  return markRaw(defineComponent({
    name: `Cell_${key}`,
    setup() {
      return () => h(UITableBodyRowCell, null, {
        default: () => h(UITableBodyRowCellText, {
          isPrimaryCell: isPrimary,
          text: String(item[key]),
        }),
      })
    },
  }))
}

const columns: TableColumn<TableGroupedData<User>>[] = [
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
]

const groupedData: TableGroupedData<User>[] = [
  {
    defaultOpen: true,
    items: [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'Admin',
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'Admin',
      },
    ],
    key: 'admins',
    label: 'Admins',
  },
  {
    defaultOpen: true,
    items: [
      {
        id: '3',
        name: 'Carol White',
        email: 'carol@example.com',
        role: 'Editor',
      },
      {
        id: '4',
        name: 'David Brown',
        email: 'david@example.com',
        role: 'Editor',
      },
      {
        id: '5',
        name: 'Eve Davis',
        email: 'eve@example.com',
        role: 'Editor',
      },
    ],
    key: 'editors',
    label: 'Editors',
  },
  {
    defaultOpen: false,
    items: [
      {
        id: '6',
        name: 'Frank Miller',
        email: 'frank@example.com',
        role: 'Viewer',
      },
    ],
    key: 'viewers',
    label: 'Viewers',
  },
]
</script>

<template>
  <div class="h-125">
    <UITable
      :columns="columns"
      :data="groupedData"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="false"
    />
  </div>
</template>
