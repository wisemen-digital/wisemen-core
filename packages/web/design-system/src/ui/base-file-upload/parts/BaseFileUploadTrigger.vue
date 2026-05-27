<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'

const {
  isDisabled,
  isMultiple,
  accept,
  onFilesSelected,
} = useInjectBaseFileUploadContext()

const fileDialog = useFileDialog()

fileDialog.onChange((fileList) => {
  if (fileList === null) {
    return
  }

  onFilesSelected(Array.from(fileList))
})

function openFileDialog(): void {
  fileDialog.open({
    accept: accept.value.join(', '),
    multiple: isMultiple.value,
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
