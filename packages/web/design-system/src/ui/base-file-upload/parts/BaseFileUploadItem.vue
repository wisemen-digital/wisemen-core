<script setup lang="ts">
import { computed } from 'vue'

import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import type {
  BaseFileUploadInfo,
  BaseFileUploadItem,
  BaseFileUploadItemPending,
  BaseFileUploadUploadOptions,
} from '@/ui/base-file-upload/baseFileUpload.type'
import {
  BaseFileUploadError,
  BaseFileUploadStatus,
} from '@/ui/base-file-upload/baseFileUpload.type'
import { useProvideBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'
import { BlurhashUtil } from '@/ui/base-file-upload/blurhash.util'
import { useInjectConfigContext } from '@/ui/config-provider'

const props = defineProps<{
  item: BaseFileUploadItem
}>()

const {
  isPublic,
  preprocess,
  onError,
  onRemoveFileUploadItem,
  onReplaceFileUploadItem,
  onStartUpload,
  onSuccess,
  onUpdateProgress,
} = useInjectBaseFileUploadContext()

const {
  fileUploadAdapter: maybeAdapter,
} = useInjectConfigContext()

if (maybeAdapter.value === null) {
  throw new Error(
    '[BaseFileUpload] No adapter provided. Add an adapter to the ConfigProvider.\n'
    + 'Example: <UIConfigProvider :file-upload-adapter="myAdapter"><UIBaseFileUploadRoot ... /></UIConfigProvider>',
  )
}

const adapter = maybeAdapter.value

async function getFileInfoData(): Promise<BaseFileUploadInfo | null> {
  const {
    name, mimeType,
  } = props.item

  try {
    return await adapter.getFileInfo(name, mimeType)
  }
  catch {
    onError(props.item, BaseFileUploadError.GET_FILE_INFO_FAILED)
  }

  return null
}

let currentXhr: XMLHttpRequest | null = null

function uploadToS3(url: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    currentXhr = xhr

    const blob = new Blob([
      file,
    ])

    xhr.upload.addEventListener('progress', (event: ProgressEvent): void => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)

        onUpdateProgress(props.item, progress)
      }
    })

    xhr.onload = (): void => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      }
      else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.onerror = (): void => {
      reject(new Error('Upload failed due to a network error'))
    }

    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', file.type)

    if (isPublic.value) {
      xhr.setRequestHeader('x-amz-acl', 'public-read')
    }
    else {
      xhr.setRequestHeader('x-amz-acl', 'private')
    }

    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
    xhr.send(blob)
  })
}

async function uploadFile(uuid: string, url: string, file: File): Promise<void> {
  const uploadOptions: BaseFileUploadUploadOptions = {
    isPublic: isPublic.value,
    onProgress: (progress) => onUpdateProgress(props.item, progress),
  }

  onStartUpload(props.item, uuid)

  if (adapter.uploadFile !== undefined) {
    await adapter.uploadFile(url, file, uploadOptions)

    return
  }

  await uploadToS3(url, file)
}

async function startUpload(): Promise<void> {
  const fileInfo = await getFileInfoData()

  if (fileInfo === null) {
    return
  }

  const {
    uuid, uploadUrl,
  } = fileInfo

  const {
    file,
  } = props.item as BaseFileUploadItemPending

  let processedFile = file

  if (preprocess !== null) {
    try {
      processedFile = await preprocess(file)
    }
    catch (error) {
      const errorMessage = error instanceof Error && error.message
        ? error.message
        : BaseFileUploadError.PREPROCESSING_FAILED

      onError(props.item, errorMessage)

      return
    }
  }

  const blurHash = await BlurhashUtil.encode(processedFile)

  try {
    await uploadFile(uuid, uploadUrl, processedFile)
  }
  catch {
    onError(props.item, BaseFileUploadError.UPLOAD_FAILED)

    return
  }

  try {
    await adapter.confirmUpload(uuid, blurHash)
    onSuccess(props.item)
  }
  catch {
    onError(props.item, BaseFileUploadError.CONFIRM_UPLOAD_FAILED)
  }
}

function onCancel(): void {
  currentXhr?.abort()
  currentXhr = null
  onRemoveFileUploadItem(props.item)
}

if (props.item.status === BaseFileUploadStatus.PENDING) {
  void startUpload()
}

useProvideBaseFileUploadItemContext({
  item: computed<BaseFileUploadItem>(() => props.item),
  onCancel,
  onRemove: () => onRemoveFileUploadItem(props.item),
  onReplace: (file) => onReplaceFileUploadItem(props.item, file),
})
</script>

<template>
  <slot
    :on-remove="() => onRemoveFileUploadItem(props.item)"
    :on-replace="(file: File) => onReplaceFileUploadItem(props.item, file)"
  />
</template>
