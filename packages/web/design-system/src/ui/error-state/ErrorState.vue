<script setup lang="ts">
import { ApiErrorUtil } from '@wisemen/vue-core-api-utils'
import { UIEmptyState } from '@wisemen/vue-core-design-system'
import { useI18n } from 'vue-i18n'

import ApiErrorState from '@/ui/error-state/ApiErrorState.vue'
import ZodErrorState from '@/ui/error-state/ZodErrorState.vue'

const props = defineProps<{
  error: unknown
}>()

const i18n = useI18n()
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
    :title="i18n.t('component.api_error_state.error_title')"
    :description="i18n.t('component.api_error_state.error_description')"
  />
</template>
