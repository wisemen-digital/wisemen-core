<script setup lang="ts">
import { TooltipArrow as RekaTooltipArrow } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTooltipContext } from '@/components/tooltip/tooltip.context'

const {
  isPopoverArrowHidden,
  classConfig,
  customClassConfig,
  style,
} = useInjectTooltipContext()
</script>

<template>
  <RekaTooltipArrow
    v-if="!isPopoverArrowHidden"
    as="div"
    class="relative -mb-4 h-4 w-10 -translate-y-px overflow-hidden"
  >
    <div
      :class="style.arrow({
        class: mergeClasses(customClassConfig.arrow, classConfig?.arrow),
      })"
    />
  </RekaTooltipArrow>
</template>
