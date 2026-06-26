<script setup lang="ts">
import { Attachment01Icon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import type { BaseFileUploadItem } from '@/ui/base-file-upload'
import { BaseFileUploadStatus } from '@/ui/base-file-upload'
import { isImageMimeType } from '@/ui/form-file-upload/formFileUpload.util'

import FormFileUploadImage from './FormFileUploadImage.vue'

const props = defineProps<{
  item: BaseFileUploadItem
}>()

const isImage = computed<boolean>(() => isImageMimeType(props.item.mimeType))
const blurHash = computed<string | null>(() => {
  if (props.item.status !== BaseFileUploadStatus.SUCCESS) {
    return null
  }

  return props.item.blurHash
})
</script>

<template>
  <div
    v-if="props.item.url !== null"
    class="
      flex size-8 shrink-0 items-center justify-center overflow-hidden
      rounded-md
    "
  >
    <FormFileUploadImage
      v-if="isImage"
      :src="props.item.url"
      :is-zoom-enabled="true"
      :blurhash="blurHash"
      :alt="props.item.name"
      fit="cover"
      class="size-full"
    />

    <Attachment01Icon
      v-else
      class="size-4.5 text-disabled"
    />
  </div>
</template>
