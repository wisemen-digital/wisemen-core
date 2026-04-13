<script setup lang="ts">
import { AnimatePresence } from 'motion-v'
import { RadioGroupIndicator as RekaRadioGroupIndicator } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectRadioGroupItemContext } from '@/components/radio-group-item/radioGroupItem.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectRadioGroupItemContext()
</script>

<template>
  <AnimatePresence>
    <RekaRadioGroupIndicator
      :class="style.indicator({
        class: mergeClasses(customClassConfig.indicator, classConfig?.indicator),
      })"
      :as-child="true"
    >
      <slot />
    </RekaRadioGroupIndicator>
  </AnimatePresence>
</template>
