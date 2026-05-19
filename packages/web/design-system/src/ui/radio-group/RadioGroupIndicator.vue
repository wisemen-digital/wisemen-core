<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { RadioGroupIndicator as RekaRadioGroupIndicator } from 'reka-ui'

import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useInjectRadioGroupItemContext } from '@/ui/radio-group/base/baseRadioGroup.context'

const {
  radioGroupStyle,
} = useInjectRadioGroupItemContext()

const isReducedMotion = useIsReducedMotion()
</script>

<template>
  <AnimatePresence>
    <RekaRadioGroupIndicator
      :class="radioGroupStyle.indicator()"
      :as-child="true"
    >
      <Motion
        :initial="{
          opacity: 0,
          scale: 1.5,
        }"
        :animate="{
          opacity: 1,
          scale: 1,
        }"
        :exit="{
          opacity: 0,
          scale: 1.5,
        }"
        :transition="{
          duration: isReducedMotion ? 0 : 0.3,
          type: 'spring',
          bounce: 0,
        }"
      />
    </RekaRadioGroupIndicator>
  </AnimatePresence>
</template>
