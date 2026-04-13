<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectCheckboxContext } from '@/components/checkbox/checkbox.context'
import CheckboxIndicator from '@/components/checkbox/parts/CheckboxIndicator.vue'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectCheckboxContext()
</script>

<template>
  <div
    :class="style.control({
      class: mergeClasses(classConfig?.control, customClassConfig?.control),
    })"
  >
    <CheckboxIndicator />
  </div>
</template>
