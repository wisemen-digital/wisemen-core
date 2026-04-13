<script setup lang="ts">
import { TabsContent as RekaTabsContent } from 'reka-ui'

import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsContentProps } from '@/ui/tabs/tabs.props'

const props = defineProps<TabsContentProps>()

const {
  variants,
} = useInjectTabsContext()
</script>

<template>
  <RekaTabsContent
    :value="props.value"
    :class="variants.content()"
  >
    <slot />
  </RekaTabsContent>
</template>
