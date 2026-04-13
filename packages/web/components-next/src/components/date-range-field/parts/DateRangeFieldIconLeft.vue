<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDateRangeFieldContext } from '@/components/date-range-field/dateRangeField.context'
import Icon from '@/components/icon/Icon.vue'

const {
  classConfig,
  customClassConfig,
  iconLeft,
  style,
} = useInjectDateRangeFieldContext()
</script>

<template>
  <Icon
    v-if="iconLeft !== null"
    :icon="iconLeft"
    :class="style.iconLeft({
      class: mergeClasses(customClassConfig.iconLeft, classConfig?.iconLeft),
    })"
  />
</template>
