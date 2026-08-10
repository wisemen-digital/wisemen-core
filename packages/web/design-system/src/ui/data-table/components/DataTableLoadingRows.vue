<script setup lang="ts">
import { UISkeletonItem } from '@/ui/skeleton-item/index'

const props = defineProps<{
  columnCount: number
  gridTemplateColumns: string
}>()

const SKELETON_ROW_COUNT = 10

const WIDTHS = [
  '60%',
  '70%',
  '65%',
  '75%',
  '60%',
  '70%',
]

function getWidth(rowIndex: number, colIndex: number): string {
  return WIDTHS[(rowIndex * props.columnCount + colIndex) % WIDTHS.length]!
}
</script>

<template>
  <div
    :style="{ gridTemplateColumns }"
    class="col-span-full grid w-full mask-b-to-transparent px-2xl"
  >
    <div
      v-for="i in SKELETON_ROW_COUNT"
      :key="i"
      :style="{ '--row-index': i - 1 }"
      class="skeleton-row col-span-full grid grid-cols-subgrid items-center gap-xl py-lg"
    >
      <UISkeletonItem
        v-for="col in props.columnCount"
        :key="col"
        :style="{ maxWidth: getWidth(i - 1, col - 1) }"
        class="h-4"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-row {
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
