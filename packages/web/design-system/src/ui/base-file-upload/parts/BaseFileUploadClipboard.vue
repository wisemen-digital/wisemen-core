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

const STORAGE_KEY = 'file-upload-clipboard-ignored-fingerprints'

function getIgnoredFingerprints(): Set<string> {
  const stored = sessionStorage.getItem(STORAGE_KEY)

  return stored !== null ? new Set(JSON.parse(stored) as string[]) : new Set()
}

function setIgnoredFingerprints(set: Set<string>): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([
    ...set,
  ]))
}

function addIgnoredFingerprint(fingerprint: string): void {
  const set = getIgnoredFingerprints()

  set.add(fingerprint)
  setIgnoredFingerprints(set)
}

function clear(): void {
  for (const entry of entries.value) {
    addIgnoredFingerprint(entry.fingerprint)
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

  interface RawEntry {
    blob: Blob
    clipboardItem: ClipboardItem
    fingerprint: string
    mimeType: string
  }

  const rawEntries: RawEntry[] = []

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

      rawEntries.push({
        blob,
        clipboardItem,
        fingerprint,
        mimeType,
      })
    }
  }

  const ignoredFingerprints = getIgnoredFingerprints()
  const hasNewContent = rawEntries.some((entry) => !ignoredFingerprints.has(entry.fingerprint))

  if (hasNewContent) {
    setIgnoredFingerprints(new Set())
  }

  const activeIgnored = hasNewContent ? new Set<string>() : ignoredFingerprints
  const foundEntries: ClipboardEntry[] = []

  for (const {
    blob,
    clipboardItem,
    fingerprint,
    mimeType,
  } of rawEntries) {
    if (activeIgnored.has(fingerprint)) {
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

  entries.value = foundEntries
}

const files = computed<File[]>(() => entries.value.map((entry) => entry.file))

useProvideBaseFileUploadClipboardContext({
  clear,
  files,
  upload,
})

async function handlePaste(event: ClipboardEvent): Promise<void> {
  if (isDisabled.value) {
    return
  }

  const pastedFiles = event.clipboardData?.files

  if (!pastedFiles || pastedFiles.length === 0) {
    return
  }

  const foundEntries: ClipboardEntry[] = []

  for (const file of pastedFiles) {
    if (!isValidMimeType({
      type: file.type,
    }, accept.value)) {
      continue
    }

    if (isValidFile.value !== null) {
      const result = isValidFile.value(file)

      if (result !== true) {
        continue
      }
    }

    const fingerprint = await getBlobFingerprint(file)

    foundEntries.push({
      file,
      fingerprint,
    })
  }

  if (foundEntries.length > 0) {
    entries.value = foundEntries
  }
}

useEventListener(window, 'focus', readClipboard)
useEventListener(window, 'paste', handlePaste)

void readClipboard()
</script>

<template>
  <slot :files="files" />
</template>
