<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  isDisabled, accept,
} = useInjectBaseFileUploadContext()

const {
  onReplace,
} = useInjectBaseFileUploadItemContext()

const fileDialog = useFileDialog()

fileDialog.onChange((fileList) => {
  if (fileList === null) {
    return
  }

  const [
    firstFile,
  ] = Array.from(fileList)

  if (firstFile === undefined) {
    return
  }

  onReplace(firstFile)
})

function openFileDialog(): void {
  if (isDisabled.value) {
    return
  }

  fileDialog.open({
    accept: accept.value.join(', '),
    multiple: false,
  })
}
</script>

<template>
  <Primitive
    :as-child="true"
    :disabled="isDisabled"
    @click="openFileDialog"
  >
    <slot />
  </Primitive>
</template>
