<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import {
  computed,
  ref,
} from 'vue'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import {
  getBlobFingerprint,
  getFileNameFromClipboardItem,
  isValidMimeType,
} from '@/ui/base-file-upload/baseFileUpload.util'
import { useProvideBaseFileUploadClipboardContext } from '@/ui/base-file-upload/baseFileUploadClipboard.context'

const {
  isDisabled,
  isValidFile,
  accept,
  onFilesSelected,
} = useInjectBaseFileUploadContext()

interface ClipboardEntry {
  file: File
  fingerprint: string
}

const entries = ref<ClipboardEntry[]>([])
const ignoredFingerprints = new Set<string>()

function clear(): void {
  for (const entry of entries.value) {
    ignoredFingerprints.add(entry.fingerprint)
  }

  entries.value = []
}

function upload(): void {
  onFilesSelected(entries.value.map((entry) => entry.file))
  clear()
}

async function readClipboard(): Promise<void> {
  if (isDisabled.value) {
    return
  }

  if (!navigator.clipboard?.read) {
    return
  }

  let clipboardItems: ClipboardItem[]

  try {
    clipboardItems = await navigator.clipboard.read()
  }
  catch {
    return
  }

  const foundEntries: ClipboardEntry[] = []

  for (const clipboardItem of clipboardItems) {
    for (const mimeType of clipboardItem.types) {
      if (!mimeType.startsWith('image/')) {
        continue
      }

      if (!isValidMimeType({
        type: mimeType,
      }, accept.value)) {
        continue
      }

      const blob = await clipboardItem.getType(mimeType)
      const fingerprint = await getBlobFingerprint(blob)

      if (ignoredFingerprints.has(fingerprint)) {
        continue
      }

      const fileName = await getFileNameFromClipboardItem(clipboardItem, mimeType)
      const file = new File(
        [
          blob,
        ],
        fileName,
        {
          type: mimeType,
        },
      )

      if (isValidFile.value !== null) {
        const result = isValidFile.value(file)

        if (result !== true) {
          continue
        }
      }

      foundEntries.push({
        file,
        fingerprint,
      })
    }
  }

  entries.value = foundEntries
}

const files = computed<File[]>(() => entries.value.map((entry) => entry.file))

useProvideBaseFileUploadClipboardContext({
  clear,
  files,
  upload,
})

useEventListener(window, 'focus', readClipboard)

void readClipboard()
</script>

<template>
  <slot :files="files" />
</template>
