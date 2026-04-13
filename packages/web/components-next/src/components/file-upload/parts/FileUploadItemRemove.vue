<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectFileUploadItemContext } from '@/components/file-upload/fileUploadItem.context'

const {
  onRemove,
} = useInjectFileUploadItemContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="onRemove"
  >
    <slot />
  </Primitive>
</template>
