<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import Icon from '@/components/icon/Icon.vue'
import { useInjectNumberFieldContext } from '@/components/number-field/numberField.context'

const {
  classConfig,
  customClassConfig,
  iconLeft,
  style,
} = useInjectNumberFieldContext()
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
