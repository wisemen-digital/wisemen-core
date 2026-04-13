<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectButtonContext } from '@/components/button/default-button/button.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectButtonContext()
</script>

<template>
  <div
    :class="style.content({
      class: mergeClasses(customClassConfig.content, classConfig?.content),
    })"
  >
    <slot />
  </div>
</template>
