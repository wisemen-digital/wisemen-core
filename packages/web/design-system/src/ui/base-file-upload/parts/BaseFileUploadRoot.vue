<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useProvideBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import type { BaseFileUploadProps } from '@/ui/base-file-upload/baseFileUpload.props'
import type {
  BaseFileInfo,
  BaseFileUploadItem,
  BaseFileUploadItemSuccess,
  BaseFileUploadRejectedFile,
} from '@/ui/base-file-upload/baseFileUpload.type'
import {
  BaseFileUploadError,
  BaseFileUploadStatus,
} from '@/ui/base-file-upload/baseFileUpload.type'
import {
  isValidMimeType,
  mapFileInfoToBaseFileUploadItem,
  mapFileToBaseUploadItem,
} from '@/ui/base-file-upload/baseFileUpload.util'

const props = withDefaults(defineProps<BaseFileUploadProps>(), {
  isDisabled: false,
  isPublic: false,
  isValidFile: null,
  disabledReason: null,
  preprocess: null,
})

const emit = defineEmits<{
  filesRejected: [files: BaseFileUploadRejectedFile[]]
}>()

const modelValue = defineModel<BaseFileInfo[] | (BaseFileInfo | null)>({
  required: true,
})
const isMultiple = computed<boolean>(() => Array.isArray(modelValue.value))

// For simplicity and consistency, the modelValue will always be normalized to an array.
const delegatedModelValue = computed<BaseFileUploadItemSuccess[]>({
  get: () => {
    if (Array.isArray(modelValue.value)) {
      return (modelValue.value as BaseFileInfo[]).map(
        (fileInfo) => mapFileInfoToBaseFileUploadItem(fileInfo, BaseFileUploadStatus.SUCCESS),
      ) as BaseFileUploadItemSuccess[]
    }

    return modelValue.value === null
      ? []
      : [
          mapFileInfoToBaseFileUploadItem(modelValue.value, BaseFileUploadStatus.SUCCESS),
        ] as BaseFileUploadItemSuccess[]
  },
  set: (updatedValue: BaseFileUploadItemSuccess[]) => {
    if (isMultiple.value) {
      modelValue.value = updatedValue.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        blurHash: item.blurHash,
        mimeType: item.mimeType,
        order: item.order,
        url: item.url,
      }))
    }
    else {
      const firstItem = updatedValue[0] ?? null

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
const internalFiles = ref<BaseFileUploadItem[]>([])

const sortedItems = computed<BaseFileUploadItem[]>(() => {
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

function onFilesSelected(files: File[]): void {
  const rejectedFiles: BaseFileUploadRejectedFile[] = []
  const validFiles: File[] = []

  for (const file of files) {
    if (!isValidMimeType(file, props.accept)) {
      rejectedFiles.push({
        error: BaseFileUploadError.INVALID_MIME_TYPE,
        file,
      })

      continue
    }

    if (props.isValidFile !== null) {
      const validationResult = props.isValidFile(file)

      if (validationResult !== true) {
        rejectedFiles.push({
          error: validationResult,
          file,
        })

        continue
      }
    }

    validFiles.push(file)
  }

  if (rejectedFiles.length > 0) {
    emit('filesRejected', rejectedFiles)
  }

  if (isMultiple.value) {
    internalFiles.value.push(...validFiles.map((file, fileIndex) => {
      return mapFileToBaseUploadItem(file, fileIndex + delegatedModelValue.value.length)
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
      mapFileToBaseUploadItem(firstFile, 0),
    ]
  }
}

function updateInternalItem(
  key: string,
  updatedItem: Partial<BaseFileUploadItem>,
): void {
  internalFiles.value = internalFiles.value.map((item) => {
    if (item.key === key) {
      return {
        ...item,
        ...updatedItem,
      } as BaseFileUploadItem
    }

    return item
  })
}

function onStartUpload(item: BaseFileUploadItem, uuid: string): void {
  updateInternalItem(item.key, {
    uuid,
    progress: 0,
    status: BaseFileUploadStatus.UPLOADING,
  })
}

function onUpdateProgress(item: BaseFileUploadItem, progress: number): void {
  updateInternalItem(item.key, {
    progress,
    status: BaseFileUploadStatus.UPLOADING,
  })
}

function onSuccess(item: BaseFileUploadItem): void {
  const updatedItem = {
    ...item,
    isSyncedWithModelValue: true,
    blurHash: null,
    status: BaseFileUploadStatus.SUCCESS,
  } as BaseFileUploadItemSuccess

  updateInternalItem(item.key, updatedItem)

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

function onError(item: BaseFileUploadItem, error: string | BaseFileUploadError): void {
  updateInternalItem(item.key, {
    error,
    status: BaseFileUploadStatus.ERROR,
  })
}

function revokeBlobUrl(url: string | null | undefined): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function onRemoveFileUploadItem(item: BaseFileUploadItem): void {
  revokeBlobUrl(item.url)
  internalFiles.value = internalFiles.value.filter((file) => file.key !== item.key)
  delegatedModelValue.value = delegatedModelValue.value.filter(
    (file) => file.uuid !== item.uuid,
  )
}

function onReplaceFileUploadItem(item: BaseFileUploadItem, file: File): void {
  delegatedModelValue.value = delegatedModelValue.value.filter((file) => file.uuid !== item.uuid)

  const fileExistsInInternalFiles = internalFiles.value.some((file) => file.key === item.key)

  if (fileExistsInInternalFiles) {
    revokeBlobUrl(item.url)
    updateInternalItem(item.key, mapFileToBaseUploadItem(file, item.order))
  }
  else {
    internalFiles.value = [
      ...internalFiles.value,
      mapFileToBaseUploadItem(file, item.order),
    ]
  }
}

useProvideBaseFileUploadContext({
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
  <slot :items="sortedItems" />
</template>
