<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadClipboardContext } from '@/ui/base-file-upload/baseFileUploadClipboard.context'

const {
  upload,
} = useInjectBaseFileUploadClipboardContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="upload"
  >
    <slot />
  </Primitive>
</template>
