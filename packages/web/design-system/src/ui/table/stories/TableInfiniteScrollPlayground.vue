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
import type { TableColumn } from '@/ui/table/types/table.type'

interface User {
  id: string
  name: string
  email: string
}

const PAGE_SIZE = 3
const TOTAL_ITEMS = 27

const allItems: User[] = Array.from({
  length: TOTAL_ITEMS,
}, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

const loadedItemCount = ref<number>(0)
const isFetchingNextPage = ref<boolean>(false)

const data = ref<User[]>([])

function fetchNextPage(): void {
  if (isFetchingNextPage.value || loadedItemCount.value >= TOTAL_ITEMS) {
    return
  }

  isFetchingNextPage.value = true

  // Simulate network latency so the loading indicator is visible.
  setTimeout(() => {
    const nextCount = Math.min(loadedItemCount.value + PAGE_SIZE, TOTAL_ITEMS)

    data.value = allItems.slice(0, nextCount)
    loadedItemCount.value = nextCount
    isFetchingNextPage.value = false
  }, 500)
}

fetchNextPage()

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
]
</script>

<template>
  <div class="flex flex-col gap-md">
    <p class="text-sm text-secondary">
      Loaded {{ loadedItemCount }} / {{ TOTAL_ITEMS }} rows, {{ PAGE_SIZE }} per page.
      The viewport below is tall enough to fit more than one page, so each page should
      keep auto-loading the next one until all rows are loaded, with no manual scrolling required.
    </p>

    <div class="h-150">
      <UITable
        :columns="columns"
        :data="data"
        :error="null"
        :get-key="(item) => item.id"
        :is-fetching-next-page="isFetchingNextPage"
        :is-loading="false"
        :on-next-page="fetchNextPage"
        variant="full-page"
      />
    </div>
  </div>
</template>
