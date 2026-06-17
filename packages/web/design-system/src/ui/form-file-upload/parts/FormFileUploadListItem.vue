<script setup lang="ts">
import type { BaseFileUploadItem } from '@/ui/base-file-upload'
import {
  BaseFileUploadStatus,
  UIBaseFileUploadItem,
} from '@/ui/base-file-upload'
import { UIRowLayout } from '@/ui/row-layout'

import FormFileUploadListItemActions from './FormFileUploadListItemActions.vue'
import FormFileUploadListItemMetadata from './FormFileUploadListItemMetadata.vue'
import FormFileUploadListItemPreview from './FormFileUploadListItemPreview.vue'
import FormFileUploadListItemSpinner from './FormFileUploadListItemSpinner.vue'

const props = defineProps<{
  item: BaseFileUploadItem
}>()
</script>

<template>
  <UIBaseFileUploadItem :item="props.item">
    <UIRowLayout
      gap="lg"
      class="
        group group/form-file-upload-list-item relative max-w-full
        overflow-hidden rounded-xl bg-secondary px-lg py-md
      "
    >
      <FormFileUploadListItemPreview :item="props.item" />
      <FormFileUploadListItemMetadata :item="props.item" />

      <FormFileUploadListItemSpinner
        v-if="props.item.status === BaseFileUploadStatus.PENDING
          || props.item.status === BaseFileUploadStatus.UPLOADING"
      />

      <FormFileUploadListItemActions
        v-else-if="props.item.status === BaseFileUploadStatus.SUCCESS
          || props.item.status === BaseFileUploadStatus.ERROR"
      />
    </UIRowLayout>
  </UIBaseFileUploadItem>
</template>
