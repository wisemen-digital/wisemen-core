<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  isDisabled,
} = useInjectBaseFileUploadContext()

const {
  onRemove,
} = useInjectBaseFileUploadItemContext()

function handleRemove(): void {
  if (isDisabled.value) {
    return
  }

  onRemove()
}
</script>

<template>
  <Primitive
    :as-child="true"
    :disabled="isDisabled"
    @click="handleRemove"
  >
    <slot />
  </Primitive>
</template>
