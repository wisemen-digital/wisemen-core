<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTableContext } from '@/components/table/table.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTableContext()
</script>

<template>
  <div
    :class="style.cellSkeleton({
      class: mergeClasses(customClassConfig?.cellSkeleton, classConfig?.cellSkeleton),
    })"
  >
    <div class="h-4 rounded-md bg-tertiary" />
  </div>
</template>
