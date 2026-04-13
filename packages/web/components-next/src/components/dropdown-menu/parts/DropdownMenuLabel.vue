<script setup lang="ts">
import { DropdownMenuLabel as RekaDropdownMenuLabel } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()
</script>

<template>
  <RekaDropdownMenuLabel
    :class="style.label({
      class: mergeClasses(customClassConfig.label, classConfig?.label),
    })"
  >
    <slot />
  </RekaDropdownMenuLabel>
</template>
