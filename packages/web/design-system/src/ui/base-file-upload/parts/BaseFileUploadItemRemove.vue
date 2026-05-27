<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useInjectBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const {
  onRemove,
} = useInjectBaseFileUploadItemContext()
</script>

<template>
  <Primitive
    :as-child="true"
    @click="onRemove"
  >
    <slot />
  </Primitive>
</template>
