<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { ZodError } from 'zod'
import { z } from 'zod'

import { UIEmptyState } from '@/ui/empty-state'

const props = defineProps<{
  error: ZodError
}>()

const clipboard = useClipboard()

function onCopyDetails(): void {
  clipboard.copy(JSON.stringify(z.treeifyError(props.error), null, 2))
}
</script>

<template>
  <UIEmptyState
    :secondary-action="{
      label: clipboard.copied.value ? 'Copied!' : 'Copy details',
      onClick: onCopyDetails,
      type: 'button',
    }"
    description="The data received from the API does not match the expected format."
    title="Data mismatch"
  />
</template>
