<script setup lang="ts">
import { DropdownMenuSeparator as RekaDropdownMenuSeparator } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()
</script>

<template>
  <RekaDropdownMenuSeparator
    :class="style.separator({
      class: mergeClasses(customClassConfig.separator, classConfig?.separator),
    })"
  />
</template>
