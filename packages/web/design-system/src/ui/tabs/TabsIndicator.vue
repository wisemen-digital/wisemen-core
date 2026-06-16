<script setup lang="ts">
import { TabsIndicator as RekaTabsIndicator } from 'reka-ui'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'

const {
  variants,
} = useInjectTabsContext()
</script>

<template>
  <RekaTabsIndicator
    :class="variants.indicator()"
  >
    <div :class="variants.indicatorInner()" />
  </RekaTabsIndicator>
</template>
