<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDateFieldContext } from '@/components/date-field/dateField.context'
import Icon from '@/components/icon/Icon.vue'

const {
  classConfig,
  customClassConfig,
  iconLeft,
  style,
} = useInjectDateFieldContext()
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
