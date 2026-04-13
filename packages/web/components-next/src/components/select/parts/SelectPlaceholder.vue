<script setup lang="ts">
import { computed } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  classConfig,
  customClassConfig,
  modelValue,
  placeholder,
  style,
} = useInjectSelectContext()

const isPlaceholderVisible = computed<boolean>(() => {
  if (Array.isArray(modelValue.value)) {
    return modelValue.value.length === 0
  }

  return modelValue.value === null
})
</script>

<template>
  <span
    v-if="isPlaceholderVisible"
    :class="style.placeholder({
      class: mergeClasses(customClassConfig.placeholder, classConfig?.placeholder),
    })"
  >
    {{ placeholder }}
  </span>
</template>
