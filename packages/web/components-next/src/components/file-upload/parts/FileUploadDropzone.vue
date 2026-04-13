<script setup lang="ts">
import {
  useDropZone,
  useEventListener,
} from '@vueuse/core'
import { Primitive } from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import { useInjectFileUploadContext } from '@/components/file-upload/fileUpload.context'

const isOverPage = ref<boolean>(false)

const {
  isMultiple, onFilesSelected,
} = useInjectFileUploadContext()

const dropzoneRef = ref<InstanceType<any> | null>(null)
const dropzoneEl = computed<HTMLElement | null>(() => dropzoneRef.value?.$el ?? null)

const {
  isOverDropZone,
} = useDropZone(dropzoneEl, {
  multiple: isMultiple.value,
  onDrop: (files) => {
    if (files !== null && files.length > 0) {
      onFilesSelected(files)
    }
  },
})

let counter = 0

function handleDragEvent(event: DragEvent, eventType: 'drop' | 'enter' | 'leave' | 'over'): void {
  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }

  switch (eventType) {
    case 'enter':
      counter += 1
      isOverPage.value = true

      break
    case 'leave':
      counter -= 1

      if (counter === 0) {
        isOverPage.value = false
      }

      break
    case 'drop':
      counter = 0
      isOverPage.value = false

      break
  }
}

useEventListener<DragEvent>(document.body, 'dragenter', (event) => handleDragEvent(event, 'enter'))
useEventListener<DragEvent>(document.body, 'dragover', (event) => handleDragEvent(event, 'over'))
useEventListener<DragEvent>(document.body, 'dragleave', (event) => handleDragEvent(event, 'leave'))
useEventListener<DragEvent>(document.body, 'drop', (event) => handleDragEvent(event, 'drop'))
</script>

<template>
  <Primitive
    ref="dropzoneRef"
    :as-child="true"
  >
    <slot
      :is-hovering-over-dropzone="isOverDropZone"
      :is-hovering-over-page="isOverPage"
    />
  </Primitive>
</template>
