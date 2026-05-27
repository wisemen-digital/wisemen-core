<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  onCancel,
} = useInjectBaseFileUploadItemContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="onCancel"
  >
    <slot />
  </Primitive>
</template>
