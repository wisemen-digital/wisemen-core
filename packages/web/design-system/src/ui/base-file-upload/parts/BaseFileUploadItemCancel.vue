<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  isDisabled,
} = useInjectBaseFileUploadContext()

const {
  onCancel,
} = useInjectBaseFileUploadItemContext()

function handleCancel(): void {
  if (isDisabled.value) {
    return
  }

  onCancel()
}
</script>

<template>
  <Primitive
    :as-child="true"
    :disabled="isDisabled"
    @click="handleCancel"
  >
    <slot />
  </Primitive>
</template>
