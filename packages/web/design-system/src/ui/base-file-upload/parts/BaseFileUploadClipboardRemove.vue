<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadClipboardContext } from '@/ui/base-file-upload/baseFileUploadClipboard.context'

const {
  clear,
} = useInjectBaseFileUploadClipboardContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="clear"
  >
    <slot />
  </Primitive>
</template>
