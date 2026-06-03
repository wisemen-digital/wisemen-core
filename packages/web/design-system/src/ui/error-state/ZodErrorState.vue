<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { UIEmptyState } from '@wisemen/vue-core-design-system'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ZodError } from 'zod'
import { z } from 'zod'

const props = defineProps<{
  error: ZodError
}>()

const i18n = useI18n()

const clipboard = useClipboard()

const copyLabel = computed<string>(() => (
  clipboard.copied.value
    ? i18n.t('component.zod_error_state.copied_label')
    : i18n.t('component.zod_error_state.copy_details_label')
))

function onCopyDetails(): void {
  clipboard.copy(JSON.stringify(z.treeifyError(props.error), null, 2))
}
</script>

<template>
  <UIEmptyState
    :secondary-action="{
      label: copyLabel,
      onClick: onCopyDetails,
      type: 'button',
    }"
    :description="i18n.t('component.zod_error_state.description')"
    :title="i18n.t('component.zod_error_state.title')"
  />
</template>
