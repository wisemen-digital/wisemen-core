<script setup lang="ts">
import { TabsContent as RekaTabsContent } from 'reka-ui'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsContentProps } from '@/ui/tabs/tabs.props'

const props = withDefaults(defineProps<TabsContentProps>(), {
  asChild: false,
})

const {
  variants,
} = useInjectTabsContext()
</script>

<template>
  <RekaTabsContent
    :as-child="props.asChild"
    :value="props.value"
    :class="variants.content()"
  >
    <slot />
  </RekaTabsContent>
</template>
