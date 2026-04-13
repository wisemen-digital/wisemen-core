<script setup lang="ts">
import { computed } from 'vue'

import Icon from '@/components/icon/Icon.vue'
import { useInjectToastContext } from '@/components/toast/toast.context'
import type { Icon as IconType } from '@/icons/icons'

const {
  customClassConfig,
  icon,
  preview,
  style,
  type,
} = useInjectToastContext()

const delegatedIcon = computed<IconType | null>(() => {
  if (icon.value !== null) {
    return icon.value
  }
  if (type.value === 'success') {
    return 'checkCircle'
  }
  if (type.value === 'error') {
    return 'alertCircle'
  }

  return 'infoCircle'
})
</script>

<template>
  <div
    v-if="preview === null && delegatedIcon"
    class="flex h-lh items-center"
  >
    <Icon
      :icon="delegatedIcon"
      :class="style.icon({
        class: customClassConfig.icon,
      })"
    />
  </div>
</template>
