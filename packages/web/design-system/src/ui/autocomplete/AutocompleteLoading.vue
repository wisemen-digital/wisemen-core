<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout'
import { UISkeletonItem } from '@/ui/skeleton-item'
import { NumberUtil } from '@/utils/number.util'
</script>

<template>
  <UIColumnLayout
    gap="xs"
    class="py-xs"
  >
    <div
      v-for="i in 3"
      :key="i"
      class="h-6 w-full p-sm"
    >
      <UISkeletonItem
        :key="i"
        :style="{
          width: `${NumberUtil.randomBetween(40, 80)}%`,
        }"
        :animate="true"
        class="h-3"
      />
    </div>
  </UIColumnLayout>
</template>
