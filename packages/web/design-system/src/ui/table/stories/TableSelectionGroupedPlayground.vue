<script setup lang="ts">
import { useActionManagerStore } from '@wisemen/vue-core-actions'
import {
  computed,
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
    isOpenByDefault: true,
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
    isOpenByDefault: true,
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
    isOpenByDefault: false,
    items: [
      {
        id: '6',
        name: 'Frank Miller',
        email: 'frank@example.com',
        role: 'Viewer',
      },
      {
        id: '7',
        name: 'Demarcus',
        email: 'demarcus@example.com',
        role: 'Viewer',
      },
      {
        id: '8',
        name: 'Shaniqua',
        email: 'shaniqua@example.com',
        role: 'Viewer',
      },
    ],
    key: 'viewers',
    label: 'Viewers',
  },
]

const allUsers = groupedData.flatMap((group) => group.items)

const manager = useActionManagerStore()

const selectedNames = computed<string[]>(() => {
  const selection = manager.tableSelection

  if (selection === null) {
    return []
  }

  const keys = new Set(selection.items)

  return allUsers.filter((item) => keys.has(item.id)).map((item) => item.name)
})
</script>

<template>
  <div class="flex h-125 flex-col gap-4">
    <div
      v-if="manager.tableSelection !== null"
      class="
        rounded-sm border border-secondary bg-primary px-4 py-2 font-mono
        text-xs
      "
    >
      <span class="font-semibold">{{ manager.tableSelection.type }}:</span>
      {{ selectedNames.join(', ') || '(none)' }}
    </div>

    <UITable
      :columns="columns"
      :data="groupedData"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="false"
      selectable
    />
  </div>
</template>
