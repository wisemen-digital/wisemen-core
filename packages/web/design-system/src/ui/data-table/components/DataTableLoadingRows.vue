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
    class="col-span-full grid w-full mask-b-to-transparent"
  >
    <div
      v-for="i in SKELETON_ROW_COUNT"
      :key="i"
      :style="{ '--row-index': i - 1 }"
      :class="{ 'border-t border-secondary': i === 1 }"
      class="
        custom-skeleton-row col-span-full grid grid-cols-subgrid border-b
        border-secondary
      "
    >
      <div
        v-for="col in props.columnCount"
        :key="col"
        class="flex h-10 items-center px-xl"
      >
        <UISkeletonItem
          :style="{ maxWidth: getWidth(i - 1, col - 1) }"
          class="h-4 w-full"
        />
      </div>
    </div>
  </div>
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
