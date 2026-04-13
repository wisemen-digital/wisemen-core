<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTooltipContext } from '@/components/tooltip/tooltip.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTooltipContext()
</script>

<template>
  <div
    :class="style.innerContent({
      class: mergeClasses(customClassConfig.innerContent, classConfig?.innerContent),
    })"
  >
    <slot />
  </div>
</template>
