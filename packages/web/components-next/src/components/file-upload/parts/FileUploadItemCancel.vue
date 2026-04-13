<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectFileUploadItemContext } from '@/components/file-upload/fileUploadItem.context'

const {
  onCancel,
} = useInjectFileUploadItemContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="onCancel"
  >
    <slot />
  </Primitive>
</template>
