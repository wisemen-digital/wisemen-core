<script setup lang="ts">
import { useId } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'
import { useInjectSelectGroupContext } from '@/components/select/selectGroup.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectSelectContext()

const groupContext = useInjectSelectGroupContext()

const id = useId()

groupContext.labelId = id
</script>

<template>
  <span
    :id="groupContext.labelId"
    :class="style.groupLabel({
      class: mergeClasses(customClassConfig.groupLabel, classConfig?.groupLabel),
    })"
  >
    <slot />
  </span>
</template>
