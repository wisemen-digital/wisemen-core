<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { UIButton } from '@/ui/button'
import type { TableColumn } from '@/ui/table/types/table.type'
import type { TableColumnState } from '@/ui/table-customization/tableCustomization.composable'
import UITableCustomizationDialog from '@/ui/table-customization/TableCustomizationDialog.vue'
import { UIText } from '@/ui/text/index'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const allColumns: TableColumn<User>[] = [
  {
    headerLabel: 'Name',
    key: 'name',
    component: () => ({}) as any,
  },
  {
    headerLabel: 'Email',
    key: 'email',
    component: () => ({}) as any,
  },
  {
    headerLabel: 'Role',
    key: 'role',
    component: () => ({}) as any,
  },
  {
    headerLabel: 'Status',
    key: 'status',
    component: () => ({}) as any,
  },
]

const isDialogOpen = ref(false)

const columnStates = ref<TableColumnState[]>(
  allColumns.map((col) => ({
    isVisible: true,
    column: col as TableColumn<unknown>,
  })),
)

// eslint-disable-next-line eslint-plugin-wisemen/vue-computed-ref-generics
const visibleColumns = computed(() => columnStates.value.filter((s) => s.isVisible))

function onColumnStatesChange(updated: TableColumnState[]): void {
  columnStates.value = updated
}

function onClose(): void {
  isDialogOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <UIButton
      :label="`Customize columns (${visibleColumns.length} visible)`"
      variant="secondary"
      @click="isDialogOpen = true"
    />

    <div class="flex flex-col gap-2">
      <UIText
        text="Visible columns:"
        class="text-sm font-medium"
      />
      <ul class="list-disc pl-4">
        <li
          v-for="state in visibleColumns"
          :key="state.column.key"
          class="text-sm"
        >
          {{ state.column.headerLabel }}
        </li>
      </ul>
    </div>

    <UITableCustomizationDialog
      v-if="isDialogOpen"
      :column-states="columnStates"
      @column-states-change="onColumnStatesChange"
      @close="onClose"
    />
  </div>
</template>
