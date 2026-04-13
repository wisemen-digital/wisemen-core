<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import type { Component } from 'vue'
import { computed } from 'vue'

import { useInjectSwitchContext } from '@/ui/switch/switch.context'

const {
  isChecked,
  iconChecked,
  iconUnchecked,
  switchStyle,
} = useInjectSwitchContext()

const icon = computed<Component | null>(() => {
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
      :key="icon?.name ?? String(isChecked)"
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
      <component
        :is="icon"
        :class="switchStyle.thumbIcon()"
      />
    </Motion>
  </AnimatePresence>
</template>
