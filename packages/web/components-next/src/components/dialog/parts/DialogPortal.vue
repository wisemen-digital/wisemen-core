<script setup lang="ts">
import { DialogPortal as RekaDialogPortal } from 'reka-ui'
import { computed } from 'vue'

import { useInjectDialogContext } from '@/components/dialog/dialog.context'

const {
  teleportTargetId,
} = useInjectDialogContext()

const teleportTarget = computed<string | null>(() => {
  if (teleportTargetId.value === null) {
    return null
  }

  return `#${teleportTargetId.value}`
})
</script>

<template>
  <RekaDialogPortal
    :disabled="teleportTargetId === null"
    :force-mount="true"
    :to="teleportTarget!"
  >
    <slot />
  </RekaDialogPortal>
</template>
