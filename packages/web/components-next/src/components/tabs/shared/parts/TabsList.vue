<script setup lang="ts">
import { TabsList as RekaTabsList } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTabsContext()
</script>

<template>
  <RekaTabsList
    :class="style.list({
      class: mergeClasses(customClassConfig.list, classConfig?.list),
    })"
  >
    <slot />
  </RekaTabsList>
</template>
