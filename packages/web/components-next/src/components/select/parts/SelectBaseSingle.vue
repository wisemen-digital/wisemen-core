<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import SelectPlaceholder from '@/components/select/parts/SelectPlaceholder.vue'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  classConfig,
  customClassConfig,
  displayFn,
  modelValue,
  style,
} = useInjectSelectContext()
</script>

<template>
  <div
    :class="style.baseSingle({
      class: mergeClasses(customClassConfig.baseSingle, classConfig?.baseSingle),
    })"
  >
    <SelectPlaceholder />

    <slot v-if="modelValue !== null">
      <span class="truncate">
        {{ displayFn(modelValue) }}
      </span>

      <slot name="right" />
    </slot>
  </div>
</template>
