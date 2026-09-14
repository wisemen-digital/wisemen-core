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
import type { TableColumn } from '@/ui/table/types/table.type'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
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

const data: User[] = Array.from({
  length: 20,
}, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  // eslint-disable-next-line no-nested-ternary
  role: i % 3 === 0 ? 'Admin' : (i % 3 === 1 ? 'Editor' : 'Viewer'),

  status: i % 4 === 0 ? 'inactive' : 'active',
}))

const manager = useActionManagerStore()

const selectedNames = computed<string[]>(() => {
  const selection = manager.tableSelection

  if (selection === null) {
    return []
  }

  const keys = new Set(selection.items)

  return data.filter((item) => keys.has(item.id)).map((item) => item.name)
})
</script>

<template>
  <div class="flex h-150 flex-col gap-4">
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
      :data="data"
      :error="null"
      :get-key="(item) => item.id"
      :is-fetching-next-page="false"
      :is-loading="false"
      selectable
    />
  </div>
</template>
