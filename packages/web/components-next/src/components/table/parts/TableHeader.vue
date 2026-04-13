<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import Subgrid from '@/components/table/parts/Subgrid.vue'
import { useInjectTableContext } from '@/components/table/table.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTableContext()
</script>

<template>
  <Subgrid
    :class="style.header({
      class: mergeClasses(customClassConfig?.header, classConfig?.header),
    })"
    role="rowgroup"
  >
    <Subgrid role="row">
      <slot />
    </Subgrid>
  </Subgrid>
</template>
