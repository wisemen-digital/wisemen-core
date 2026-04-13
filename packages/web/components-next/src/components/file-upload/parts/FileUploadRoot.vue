<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { useProvideFileUploadContext } from '@/components/file-upload/fileUpload.context'
import type { FileUploadProps } from '@/components/file-upload/fileUpload.props'
import type {
  FileInfo,
  FileUploadItem,
  FileUploadItemSuccess,
} from '@/components/file-upload/fileUpload.type'
import { FileUploadStatus } from '@/components/file-upload/fileUpload.type'
import {
  mapFileInfoToFileUploadItem,
  mapFileToUploadItem,
} from '@/components/file-upload/fileUpload.util'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<FileUploadProps>(), {
  isDisabled: false,
  isPublic: false,
  isValidFile: null,
  preprocess: null,
})

const emit = defineEmits<{
  filesRejected: [files: File[]]
}>()

const modelValue = defineModel<FileInfo[] | (FileInfo | null)>({
  required: true,
})
const isMultiple = computed<boolean>(() => Array.isArray(modelValue.value))

// For simplicity and consistency, the modelValue will always be normalized to an array.
const delegatedModelValue = computed<FileUploadItemSuccess[]>({
  get: () => {
    if (Array.isArray(modelValue.value)) {
      return (modelValue.value as FileInfo[]).map(
        (fileInfo) => mapFileInfoToFileUploadItem(fileInfo, FileUploadStatus.SUCCESS),
      ) as FileUploadItemSuccess[]
    }

    return modelValue.value === null
      ? []
      : [
          mapFileInfoToFileUploadItem(modelValue.value, FileUploadStatus.SUCCESS),
        ] as FileUploadItemSuccess[]
  },
  set: (newValue: FileUploadItemSuccess[]) => {
    if (isMultiple.value) {
      modelValue.value = newValue.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        blurHash: item.blurHash,
        mimeType: item.mimeType,
        order: item.order,
        url: item.url,
      }))
    }
    else {
      const firstItem = newValue[0] ?? null

      if (firstItem === null) {
        modelValue.value = null

        return
      }

      modelValue.value = {
        uuid: firstItem.uuid,
        name: firstItem.name,
        blurHash: firstItem.blurHash,
        mimeType: firstItem.mimeType,
        order: firstItem.order,
        url: firstItem.url,
      }
    }
  },
})

// Internal state to hold the files to make sure there's no layout shift
const internalFiles = ref<FileUploadItem[]>([])

const sortedFileUploadItems = computed<FileUploadItem[]>(() => {
  return [
    ...delegatedModelValue.value.filter((item) => {
      // Check if exists in internalFiles
      // If so, check if modelValue is synced with internal state
      const existsInInternalFiles = internalFiles.value.some(
        (file) => file.uuid === item.uuid,
      )

      if (!existsInInternalFiles) {
        return true
      }

      return !item.isSyncedWithModelValue
    }),
    ...internalFiles.value,
  ]
    .toSorted((a, b) => a.order - b.order)
    // If not in multiple mode, keep only the last file.
    // This ensures the UI always displays the most recent file.
    // We slice instead of clearing the model to avoid showing a temporary validation error
    // (e.g., if the file is required, clearing the model would make it null until the new file finishes uploading).
    .slice(isMultiple.value ? undefined : -1)
})

function isValidFile(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type === '*/*') {
      return true
    }

    if (type.endsWith('/*')) {
      const [
        mainType,
      ] = type.split('/')

      return file.type.startsWith(`${mainType}/`)
    }

    return file.type === type
  })
}

function onFilesSelected(files: File[]): void {
  // TODO: clean up
  let validFiles = files

  validFiles = validFiles.filter((file) => isValidFile(file, props.accept))

  validFiles = props.isValidFile === null
    ? validFiles
    : files.filter((file) => props.isValidFile!(file))

  validFiles = validFiles.slice(0, isMultiple.value ? undefined : 1)

  const invalidFiles = files.filter((file) => !validFiles.includes(file))

  if (invalidFiles.length > 0) {
    emit('filesRejected', invalidFiles)
  }

  if (isMultiple.value) {
    internalFiles.value.push(...validFiles.map((file, fileIndex) => {
      return mapFileToUploadItem(file, fileIndex + delegatedModelValue.value.length)
    }))
  }
  else {
    const [
      firstFile,
    ] = validFiles

    if (firstFile === undefined) {
      return
    }

    internalFiles.value = [
      mapFileToUploadItem(firstFile, 0),
    ]
  }
}

function updateInternalFileUploadItem(
  key: string,
  updatedItem: Partial<FileUploadItem>,
): void {
  internalFiles.value = internalFiles.value.map((item) => {
    if (item.key === key) {
      return {
        ...item,
        ...updatedItem,
      } as FileUploadItem
    }

    return item
  })
}

function onStartUpload(item: FileUploadItem, uuid: string): void {
  updateInternalFileUploadItem(item.key, {
    uuid,
    progress: 0,
    status: FileUploadStatus.UPLOADING,
  })
}

function onUpdateProgress(item: FileUploadItem, progress: number): void {
  updateInternalFileUploadItem(item.key, {
    progress,
    status: FileUploadStatus.UPLOADING,
  })
}

function onSuccess(item: FileUploadItem): void {
  const updatedItem = {
    ...item,
    isSyncedWithModelValue: true,
    blurHash: null,
    status: FileUploadStatus.SUCCESS,
  } as FileUploadItemSuccess

  updateInternalFileUploadItem(item.key, updatedItem)

  if (isMultiple.value) {
    delegatedModelValue.value = [
      ...delegatedModelValue.value.filter((file) => file.uuid !== item.uuid),
      updatedItem,
    ]
  }
  else {
    delegatedModelValue.value = [
      updatedItem,
    ]
  }
}

function onError(item: FileUploadItem, errorMessage: string): void {
  updateInternalFileUploadItem(item.key, {
    errorMessage,
    status: FileUploadStatus.ERROR,
  })
}

function onRemoveFileUploadItem(item: FileUploadItem): void {
  internalFiles.value = internalFiles.value.filter((file) => file.key !== item.key)
  delegatedModelValue.value = delegatedModelValue.value.filter(
    (file) => file.uuid !== item.uuid,
  )
}

function onReplaceFileUploadItem(item: FileUploadItem, file: File): void {
  delegatedModelValue.value = delegatedModelValue.value.filter((file) => file.uuid !== item.uuid)

  const fileExistsInInternalFiles = internalFiles.value.some((file) => file.key === item.key)

  if (fileExistsInInternalFiles) {
    updateInternalFileUploadItem(item.key, mapFileToUploadItem(file, item.order))
  }
  else {
    internalFiles.value = [
      ...internalFiles.value,
      mapFileToUploadItem(file, item.order),
    ]
  }
}

useProvideFileUploadContext({
  ...toComputedRefs(props),
  isMultiple,
  preprocess: props.preprocess,
  onError,
  onFilesSelected,
  onRemoveFileUploadItem,
  onReplaceFileUploadItem,
  onStartUpload,
  onSuccess,
  onUpdateProgress,
})
</script>

<template>
  <slot :items="sortedFileUploadItems" />
</template>
