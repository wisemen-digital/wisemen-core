<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { BaseFileUploadItem } from '@/ui/base-file-upload'
import { BaseFileUploadStatus } from '@/ui/base-file-upload'
import { UIColumnLayout } from '@/ui/column-layout'
import type { FormFileUploadErrorLabels } from '@/ui/form-file-upload/formFileUpload.util'
import { getFormFileUploadErrorMessage } from '@/ui/form-file-upload/formFileUpload.util'
import { UIText } from '@/ui/text'

const props = defineProps<{
  item: BaseFileUploadItem
}>()

const i18n = useI18n()
const errorLabels = computed<FormFileUploadErrorLabels>(() => ({
  invalidType: i18n.t('component.form_file_upload.error.invalid_type'),
  preprocessingFailed: i18n.t('component.form_file_upload.error.preprocessing_failed'),
  uploadFailed: i18n.t('component.form_file_upload.error.upload_failed'),
}))
const errorText = computed<string | null>(() => {
  if (props.item.status !== BaseFileUploadStatus.ERROR) {
    return null
  }

  return getFormFileUploadErrorMessage(props.item.error, errorLabels.value)
})
</script>

<template>
  <UIColumnLayout
    gap="none"
    class="overflow-hidden"
  >
    <UIText
      :text="props.item.name"
      class="text-sm text-primary"
    />

    <div
      v-if="props.item.status === BaseFileUploadStatus.UPLOADING || props.item.status === BaseFileUploadStatus.PENDING"
      class="flex h-4.5 items-start"
    >
      <div class="mt-sm h-1 w-40 overflow-hidden rounded-full bg-tertiary">
        <div
          v-if="props.item.status === BaseFileUploadStatus.UPLOADING"
          :style="{ width: `${props.item.progress}%` }"
          class="h-full bg-quaternary duration-100"
        />
      </div>
    </div>

    <UIText
      v-else-if="props.item.status === BaseFileUploadStatus.SUCCESS"
      :text="props.item.mimeType"
      class="text-xs text-tertiary"
    />

    <UIText
      v-else-if="props.item.status === BaseFileUploadStatus.ERROR"
      :text="errorText ?? ''"
      class="text-xs text-error-primary"
    />
  </UIColumnLayout>
</template>
