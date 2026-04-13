<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { Primitive } from 'reka-ui'

import { useInjectFileUploadContext } from '@/components/file-upload/fileUpload.context'
import { useInjectFileUploadItemContext } from '@/components/file-upload/fileUploadItem.context'
import InteractableElement from '@/components/shared/InteractableElement.vue'

const {
  isDisabled,
  isMultiple,
  accept,
} = useInjectFileUploadContext()

const {
  onReplace,
} = useInjectFileUploadItemContext()

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
  fileDialog.open({
    accept: accept.value.join(', '),
    multiple: isMultiple.value,
  })
}
</script>

<template>
  <InteractableElement :is-disabled="isDisabled">
    <Primitive
      :as-child="true"
      @click="openFileDialog"
    >
      <slot />
    </Primitive>
  </InteractableElement>
</template>
