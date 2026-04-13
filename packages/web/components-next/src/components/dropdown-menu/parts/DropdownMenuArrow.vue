<script setup lang="ts">
import { DropdownMenuArrow as RekaDropdownMenuArrow } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'

const {
  isPopoverArrowHidden,
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()
</script>

<template>
  <RekaDropdownMenuArrow
    v-if="!isPopoverArrowHidden"
    as="div"
    class="relative -mb-4 h-4 w-8 overflow-hidden"
  >
    <div
      :class="style.arrow({
        class: mergeClasses(customClassConfig.arrow, classConfig?.arrow),
      })"
    />
  </RekaDropdownMenuArrow>
</template>
