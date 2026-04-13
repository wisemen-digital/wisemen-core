<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTableContext } from '@/components/table/table.context'

const props = withDefaults(defineProps<{
  hasInteractiveContent?: boolean
  isPrimaryCell?: boolean
}>(), {
  hasInteractiveContent: false,
  isPrimaryCell: false,
})

const {
  hasReachedHorizontalEnd,
  isFirstColumnSticky,
  isLastColumnSticky,
  isScrolledHorizontally,
  classConfig,
  customClassConfig,
  style,
} = useInjectTableContext()
</script>

<template>
  <div
    :class="[
      style.cell({
        class: mergeClasses(customClassConfig?.cell, classConfig?.cell),
      }),
      {
        'first-of-type:sticky first-of-type:left-0 first-of-type:border-r': isFirstColumnSticky,
        'last-of-type:sticky last-of-type:right-0 last-of-type:border-l': isLastColumnSticky,
        'first-of-type:border-r-secondary': isScrolledHorizontally,
        'first-of-type:border-r-transparent': !isScrolledHorizontally,
        'last-of-type:border-l-secondary': !hasReachedHorizontalEnd,
        'last-of-type:border-l-transparent': hasReachedHorizontalEnd,
        'first-of-type:z-1': isFirstColumnSticky && !props.hasInteractiveContent,
        'first-of-type:z-3': isFirstColumnSticky && props.hasInteractiveContent,
        'last-of-type:z-1': isLastColumnSticky && !props.hasInteractiveContent,
        'last-of-type:z-3': isLastColumnSticky && props.hasInteractiveContent,
      },
    ]"
    :data-sticky="isFirstColumnSticky || isLastColumnSticky || undefined"
    :data-primary-cell="props.isPrimaryCell || undefined"
    role="cell"
  >
    <slot />
  </div>
</template>
