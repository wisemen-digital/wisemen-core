<script setup lang="ts">
import {
  RefreshCcw02Icon,
  Trash01Icon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import {
  UIBaseFileUploadItemRemove,
  UIBaseFileUploadItemReplace,
} from '@/ui/base-file-upload'
import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { UIIconButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'

const i18n = useI18n()

const {
  isDisabled,
} = useInjectBaseFileUploadContext()
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
