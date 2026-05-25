<script setup lang="ts">
import { UISkeletonItem } from '@/ui/skeleton-item/index'
import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { useInjectTableContext } from '@/ui/table/context/table.context'

const {
  gridTemplateColumns,
} = useInjectTableContext()

const widths = [
  '60%',
  '70%',
  '65%',
  '75%',
  '60%',
  '70%',
]

function getWidth(rowIndex: number, colIndex: number): string {
  return widths[(rowIndex * 3 + colIndex) % widths.length]!
}
</script>

<template>
  <TableSubgrid
    :style="{ gridTemplateColumns }"
    class="z-10 grid w-full mask-b-to-transparent px-2xl"
  >
    <TableSubgrid
      v-for="i in 10"
      :key="i"
      :style="{ '--row-index': i - 1 }"
      class="custom-skeleton-row py-lg"
    >
      <UISkeletonItem
        v-for="col in 3"
        :key="col"
        :style="{ maxWidth: getWidth(i - 1, col - 1) }"
        class="h-4"
      />
    </TableSubgrid>
  </TableSubgrid>
</template>

<style scoped>
.custom-skeleton-row {
  animation: skeleton-wave 1.8s ease-in-out infinite;
  animation-delay: calc(var(--row-index) * 80ms);
}

@keyframes skeleton-wave {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
