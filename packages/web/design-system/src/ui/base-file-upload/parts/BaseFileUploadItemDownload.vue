<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'
import { BaseFileUploadStatus } from '@/ui/base-file-upload/baseFileUpload.type'

const {
  hasDownloadListener,
  onDownload,
} = useInjectBaseFileUploadContext()

const {
  item,
} = useInjectBaseFileUploadItemContext()

const canDownload = computed<boolean>(() => {
  return item.value.status === BaseFileUploadStatus.SUCCESS
    && (hasDownloadListener.value || (item.value.url?.length ?? 0) > 0)
})

function downloadFile(): void {
  if (item.value.status !== BaseFileUploadStatus.SUCCESS) {
    return
  }

  if (hasDownloadListener.value) {
    onDownload(item.value)

    return
  }

  if (item.value.url === null || item.value.url.length === 0) {
    return
  }

  const link = document.createElement('a')

  link.href = item.value.url
  link.download = item.value.name

  link.click()
}
</script>

<template>
  <Primitive
    v-if="canDownload"
    :as-child="true"
    @click="downloadFile"
  >
    <slot />
  </Primitive>
</template>
