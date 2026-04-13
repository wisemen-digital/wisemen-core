<script setup lang="ts">
import { SwitchThumb as RekaSwitchThumb } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSwitchContext } from '@/components/switch/switch.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectSwitchContext()
</script>

<template>
  <RekaSwitchThumb
    :class="style.thumb({
      class: mergeClasses(customClassConfig.thumb, classConfig?.thumb),
    })"
  >
    <slot />
  </RekaSwitchThumb>
</template>
