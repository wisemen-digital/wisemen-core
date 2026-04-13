<script setup lang="ts">
import { useAttrs } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'
import { useInjectDropdownMenuItemContext } from '@/components/dropdown-menu/dropdownMenuItem.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()

const {
  label,
} = useInjectDropdownMenuItemContext()
const attrs = useAttrs()
</script>

<template>
  <span
    :class="style.itemLabel({
      class: mergeClasses(customClassConfig.itemLabel, classConfig?.itemLabel, attrs.class as string),
    })"
  >
    {{ label }}
  </span>
</template>
