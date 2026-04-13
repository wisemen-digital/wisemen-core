<script setup lang="ts">
import type { VariantType } from 'motion-v'
import {
  AnimatePresence,
  motion,
} from 'motion-v'
import { CheckboxIndicator as RekaCheckboxIndicator } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectCheckboxContext } from '@/components/checkbox/checkbox.context'

const draw: Record<string, VariantType> = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      opacity: {
        duration: 0.01,
      },
      pathLength: {
        bounce: 0,
        duration: 0.5,
        type: 'spring',
      },
    },
  },
}

const {
  isIndeterminate,
  classConfig,
  customClassConfig,
  style,
} = useInjectCheckboxContext()
</script>

<template>
  <AnimatePresence :initial="false">
    <RekaCheckboxIndicator
      :class="style.indicator({
        class: mergeClasses(customClassConfig.indicator, classConfig?.indicator),
      })"
      :as-child="true"
    >
      <slot>
        <svg
          v-if="isIndeterminate"
          width="100%"
          height="100%"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.path
            :variants="draw"
            tabindex="-1"
            initial="hidden"
            d="M2.5 6H9.5"
            stroke="currentColor"
            stroke-width="1.66666"
            stroke-linecap="round"
            stroke-linejoin="round"
            animate="visible"
            exit="hidden"
          />
        </svg>

        <svg
          v-else
          width="100%"
          height="100%"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.path
            :variants="draw"
            tabindex="-1"
            initial="hidden"
            d="M2 6L4.5 8.5L10 3"
            stroke="currentColor"
            stroke-width="1.6666"
            stroke-linecap="round"
            stroke-linejoin="round"
            animate="visible"
            exit="hidden"
          />
        </svg>
      </slot>
    </RekaCheckboxIndicator>
  </AnimatePresence>
</template>
