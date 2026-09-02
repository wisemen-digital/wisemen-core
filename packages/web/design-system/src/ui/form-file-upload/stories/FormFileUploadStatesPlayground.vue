<script setup lang="ts">
import { ref } from 'vue'

import type { BaseFileInfo } from '@/ui/base-file-upload'
import { UIColumnLayout } from '@/ui/column-layout'
import FormFileUpload from '@/ui/form-file-upload/FormFileUpload.vue'

const props = withDefaults(defineProps<{
  accept?: string[]
  description?: string
}>(), {
  accept: () => [
    'image/*',
    'application/pdf',
    'text/plain',
  ],
  description: 'Images, PDFs, and text files are supported.',
})

const previewImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect width="96" height="96" rx="16" fill="#F97316" />
    <circle cx="32" cy="32" r="10" fill="#FED7AA" />
    <path d="M18 72L40 48L52 60L64 44L78 72H18Z" fill="#FFF7ED" />
  </svg>
`)}`

const singleValue = ref<BaseFileInfo | null>({
  uuid: 'storybook-single',
  name: 'cover-image.png',
  blurHash: null,
  mimeType: 'image/png',
  order: 0,
  url: previewImageUrl,
})

const multipleValue = ref<BaseFileInfo[]>([
  {
    uuid: 'storybook-image',
    name: 'team-photo.png',
    blurHash: null,
    mimeType: 'image/png',
    order: 0,
    url: previewImageUrl,
  },
  {
    uuid: 'storybook-document',
    name: 'brief.pdf',
    blurHash: null,
    mimeType: 'application/pdf',
    order: 1,
    url: 'https://example.com/brief.pdf',
  },
])

const disabledValue = ref<BaseFileInfo[]>([
  {
    uuid: 'storybook-disabled',
    name: 'locked-file.txt',
    blurHash: null,
    mimeType: 'text/plain',
    order: 0,
    url: 'https://example.com/locked-file.txt',
  },
])

const errorValue = ref<BaseFileInfo | null>(null)
</script>

<template>
  <UIColumnLayout class="max-w-160">
    <FormFileUpload
      v-model="singleValue"
      :accept="props.accept"
      :description="props.description"
      hint="Single-file mode with a preview image."
      label="Prefilled single"
    />

    <FormFileUpload
      v-model="multipleValue"
      :accept="props.accept"
      :description="props.description"
      hint="Multiple mode with image and document items."
      label="Prefilled multiple"
    />

    <FormFileUpload
      v-model="disabledValue"
      :accept="props.accept"
      :description="props.description"
      :is-disabled="true"
      hint="Upload interactions are disabled."
      label="Disabled"
    />

    <FormFileUpload
      v-model="errorValue"
      :accept="props.accept"
      :description="props.description"
      error-message="Please upload at least one file."
      label="With error"
    />
  </UIColumnLayout>
</template>
