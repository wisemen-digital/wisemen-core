<script setup lang="ts">
import { DropdownMenuGroup as RekaDropdownMenuGroup } from 'reka-ui'
import { useAttrs } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()

const attrs = useAttrs()
</script>

<template>
  <RekaDropdownMenuGroup
    :class="style.group({
      class: mergeClasses(customClassConfig.group, classConfig?.group, attrs.class as string),
    })"
  >
    <slot />
  </RekaDropdownMenuGroup>
</template>
