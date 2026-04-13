<script setup lang="ts">
import { computed } from 'vue'

import { useProvideMainSidebarNavigationLinkContext } from '@/ui/sidebar/components/mainSidebarNavigationLink.context'

const props = defineProps<{
  isActive: boolean
}>()

useProvideMainSidebarNavigationLinkContext({
  isActive: computed<boolean>(() => props.isActive),
})
</script>

<template>
  <slot />
</template>
