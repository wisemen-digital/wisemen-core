<script setup lang="ts">
import {
  defineComponent,
  h,
  markRaw,
  ref,
} from 'vue'

import UITable from '@/ui/table/components/Table.vue'
import UITableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import UITableBodyRowCellText from '@/ui/table/components/TableBodyRowCellText.vue'
import type {
  TableColumn,
  TableGroupedData,
  TableSelectionState,
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
    ],
    key: 'viewers',
    label: 'Viewers',
  },
]

const selectionState = ref<TableSelectionState<User> | null>(null)

function onSelect(state: TableSelectionState<User>): void {
  selectionState.value = state
}
</script>

<template>
  <div class="flex h-125 flex-col gap-4">
    <div
      v-if="selectionState !== null"
      class="
        rounded-sm border border-secondary bg-primary px-4 py-2 font-mono
        text-xs
      "
    >
      <span class="font-semibold">{{ selectionState.type }}:</span>
      {{ selectionState.items.map(u => u.name).join(', ') || '(none)' }}
    </div>

    <UITable
      :columns="columns"
      :data="groupedData"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="false"
      selectable
      @select="onSelect"
    />
  </div>
</template>
