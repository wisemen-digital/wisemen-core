<script setup lang="ts">
import type {
  ApiErrorObject,
  ApiExpectedError,
} from '@wisemen/vue-core-api-utils'
import { computed } from 'vue'

import { UIEmptyState } from '@/ui/empty-state'

const props = defineProps<{
  error: ApiExpectedError
}>()

const firstError = computed<ApiErrorObject | null>(() => {
  const [
    firstError,
  ] = props.error.errors ?? []

  return firstError ?? null
})
</script>

<template>
  <UIEmptyState
    :title="firstError?.status ?? 'Error'"
    :error="firstError?.detail ?? 'An unexpected error occurred'"
  />
</template>
