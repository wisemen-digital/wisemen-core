<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
import { useRoute } from 'vitepress'
import { computed } from 'vue'

import {
  isApiRoute,
  isWebRoute,
} from './getStack.util'

interface StackBadgeConfig {
  color: 'blue' | 'moss'
  label: string
}

const route = useRoute()

const activeStack = computed<StackBadgeConfig | null>(() => {
  if (isWebRoute(route.path)) {
    return {
      color: 'moss',
      label: 'Web',
    }
  }

  if (isApiRoute(route.path)) {
    return {
      color: 'blue',
      label: 'API',
    }
  }

  return null
})
</script>

<template>
  <UIBadge
    v-if="activeStack"
    :label="activeStack.label"
    :color="activeStack.color"
    size="sm"
    class="text-sm!"
  />
</template>

<style scoped>

</style>
