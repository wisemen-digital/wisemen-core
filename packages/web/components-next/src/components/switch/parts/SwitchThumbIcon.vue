<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import { computed } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import Icon from '@/components/icon/Icon.vue'
import { useInjectSwitchContext } from '@/components/switch/switch.context'
import type { Icon as IconType } from '@/icons/icons'

const {
  isChecked,
  classConfig,
  customClassConfig,
  iconChecked,
  iconUnchecked,
  style,
} = useInjectSwitchContext()

const icon = computed<IconType | null>(() => {
  if (isChecked.value) {
    return iconChecked.value
  }

  return iconUnchecked.value
})
</script>

<template>
  <AnimatePresence
    :initial="false"
    mode="popLayout"
  >
    <Motion
      v-if="icon !== null"
      :key="icon"
      :initial="{
        opacity: 0,
        x: isChecked ? -8 : 8,
        filter: 'blur(2px)',
      }"
      :animate="{
        opacity: 1,
        scale: 1,
        x: 0,
        filter: 'blur(0px)',
      }"
      :exit="{
        opacity: 0,
        x: isChecked ? -8 : 8,
        filter: 'blur(2px)',
      }"
      :transition="{
        duration: 0.25,
        type: 'spring',
        bounce: 0,
      }"
    >
      <Icon
        :icon="icon"
        :class="style.thumbIcon({
          class: mergeClasses(customClassConfig.thumbIcon, classConfig?.thumbIcon),
        })"
      />
    </Motion>
  </AnimatePresence>
</template>
