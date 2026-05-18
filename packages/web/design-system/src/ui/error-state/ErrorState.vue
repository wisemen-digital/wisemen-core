<script setup lang="ts">
import { ApiErrorUtil } from '@repo/api-utils'

import { UIEmptyState } from '@/ui/empty-state'
import ApiErrorState from '@/ui/error-state/ApiErrorState.vue'
import ZodErrorState from '@/ui/error-state/ZodErrorState.vue'

const props = defineProps<{
  error: unknown
}>()
</script>

<template>
  <ApiErrorState
    v-if="ApiErrorUtil.isExpectedApiError(props.error)"
    :error="props.error"
  />

  <ZodErrorState
    v-else-if="ApiErrorUtil.isZodError(props.error)"
    :error="props.error"
  />

  <UIEmptyState
    v-else
    title="Error"
    description="An unexpected error occurred"
  />
</template>
