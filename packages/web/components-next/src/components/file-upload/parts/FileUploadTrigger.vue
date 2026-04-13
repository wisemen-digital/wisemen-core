<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { Primitive } from 'reka-ui'

import { useInjectFileUploadContext } from '@/components/file-upload/fileUpload.context'
import InteractableElement from '@/components/shared/InteractableElement.vue'

const {
  isDisabled,
  isMultiple,
  accept,
  onFilesSelected,
} = useInjectFileUploadContext()

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
  <InteractableElement :is-disabled="isDisabled">
    <Primitive
      :as-child="true"
      @click="openFileDialog"
    >
      <slot />
    </Primitive>
  </InteractableElement>
</template>
