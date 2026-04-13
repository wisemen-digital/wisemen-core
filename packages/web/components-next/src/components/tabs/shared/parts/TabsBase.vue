<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTabsContext()
</script>

<template>
  <div :class="style.base({ class: mergeClasses(classConfig?.base, customClassConfig.base) })">
    <slot />
  </div>
</template>
