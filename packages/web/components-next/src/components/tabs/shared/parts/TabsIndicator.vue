<script setup lang="ts">
import { TabsIndicator as RekaTabsIndicator } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTabsContext()
</script>

<template>
  <RekaTabsIndicator
    :class="style.indicator({
      class: mergeClasses(customClassConfig.indicator, classConfig?.indicator),
    })"
  />
</template>
