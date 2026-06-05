<script setup lang="ts">
import type {
  ApiErrorObject,
  ApiExpectedError,
} from '@wisemen/vue-core-api-utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { UIEmptyState } from '@/ui/empty-state/index'

const props = defineProps<{
  error: ApiExpectedError
}>()

const i18n = useI18n()

const firstError = computed<ApiErrorObject | null>(() => {
  const [
    firstError,
  ] = props.error.errors ?? []

  return firstError ?? null
})
</script>

<template>
  <UIEmptyState
    :title="firstError?.status ?? i18n.t('component.api_error_state.error_title')"
    :description="firstError?.detail ?? i18n.t('component.api_error_state.error_description')"
  />
</template>
