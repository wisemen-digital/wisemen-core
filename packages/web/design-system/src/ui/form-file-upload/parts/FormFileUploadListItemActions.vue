<script setup lang="ts">
import {
  Download01Icon,
  RefreshCcw02Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import type { BaseFileUploadItem } from '@/ui/base-file-upload'
import {
  UIBaseFileUploadItemRemove,
  UIBaseFileUploadItemReplace,
} from '@/ui/base-file-upload'
import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { UIIconButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'

const props = defineProps<{
  item: BaseFileUploadItem
}>()

const i18n = useI18n()

const {
  isDisabled,
} = useInjectBaseFileUploadContext()

function downloadFile(): void {
  if (props.item.url === null) {
    return
  }

  const link = document.createElement('a')

  link.href = props.item.url
  link.download = props.item.name

  link.click()
}
</script>

<template>
  <UIRowLayout
    class="
      absolute right-0 h-full bg-linear-to-l from-secondary via-secondary
      via-80% px-lg opacity-0 duration-100
      group-hover/form-file-upload-list-item:opacity-100
      group-has-focus-visible/form-file-upload-list-item:opacity-100
      pointer-coarse:opacity-100
    "
    gap="xs"
  >
    <UIIconButton
      v-if="props.item.url !== null"
      :icon="Download01Icon"
      :label="i18n.t('component.form_file_upload.action.download')"
      variant="tertiary"
      size="sm"
      @click="downloadFile"
    />

    <UIBaseFileUploadItemReplace>
      <UIIconButton
        :icon="RefreshCcw02Icon"
        :is-disabled="isDisabled"
        :label="i18n.t('component.form_file_upload.action.replace')"
        variant="tertiary"
        size="sm"
      />
    </UIBaseFileUploadItemReplace>

    <UIBaseFileUploadItemRemove>
      <UIIconButton
        :icon="Trash01Icon"
        :is-disabled="isDisabled"
        :label="i18n.t('component.form_file_upload.action.delete')"
        variant="tertiary"
        size="sm"
      />
    </UIBaseFileUploadItemRemove>
  </UIRowLayout>
</template>
