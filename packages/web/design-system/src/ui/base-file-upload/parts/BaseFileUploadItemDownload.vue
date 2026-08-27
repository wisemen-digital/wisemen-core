<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  item,
} = useInjectBaseFileUploadItemContext()

function downloadFile(): void {
  if (item.value.url === null) {
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
    v-if="item.url !== null"
    :as-child="true"
    @click="downloadFile"
  >
    <slot />
  </Primitive>
</template>
