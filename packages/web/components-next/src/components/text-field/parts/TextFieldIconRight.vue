<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import Icon from '@/components/icon/Icon.vue'
import { useInjectTextFieldContext } from '@/components/text-field/textField.context'

const {
  isLoading,
  classConfig,
  customClassConfig,
  iconRight,
  style,
} = useInjectTextFieldContext()
</script>

<template>
  <Icon
    v-if="iconRight !== null && !isLoading"
    :icon="iconRight"
    :class="style.iconRight({
      class: mergeClasses(customClassConfig.iconRight, classConfig?.iconRight),
    })"
  />
</template>
