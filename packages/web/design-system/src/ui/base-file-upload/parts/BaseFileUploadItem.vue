<script setup lang="ts">
import { computed } from 'vue'

import { BlurhashUtil } from '@/ui/base-file-upload/blurhash.util'
import { useInjectBaseFileUploadContext } from '@/ui/base-file-upload/baseFileUpload.context'
import type {
  BaseFileUploadInfo,
  BaseFileUploadItem,
  BaseFileUploadItemPending,
} from '@/ui/base-file-upload/baseFileUpload.type'
import {
  BaseFileUploadError,
  BaseFileUploadStatus,
} from '@/ui/base-file-upload/baseFileUpload.type'
import { useProvideBaseFileUploadItemContext } from '@/ui/base-file-upload/baseFileUploadItem.context'

const props = defineProps<{
  item: BaseFileUploadItem
}>()

const {
  isPublic,
  confirmUpload,
  getFileInfo,
  preprocess,
  onError,
  onRemoveFileUploadItem,
  onReplaceFileUploadItem,
  onStartUpload,
  onSuccess,
  onUpdateProgress,
} = useInjectBaseFileUploadContext()

async function getFileInfoData(): Promise<BaseFileUploadInfo | null> {
  const {
    name, mimeType,
  } = props.item

  try {
    return await getFileInfo(name, mimeType)
  }
  catch {
    onError(props.item, BaseFileUploadError.UPLOAD_FAILED)
  }

  return null
}

function uploadToS3(uuid: string, url: string, file: File): Promise<void> {
  onStartUpload(props.item, uuid)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
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
        onSuccess(props.item)
        resolve()
      }
      else {
        onError(props.item, BaseFileUploadError.UPLOAD_FAILED)
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.onerror = (): void => {
      onError(props.item, BaseFileUploadError.UPLOAD_FAILED)
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

async function uploadFile(): Promise<void> {
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
    catch {
      onError(props.item, BaseFileUploadError.PREPROCESSING_FAILED)

      return
    }
  }

  const blurHash = await BlurhashUtil.encode(processedFile)

  try {
    await uploadToS3(uuid, uploadUrl, processedFile)
    await confirmUpload(uuid, blurHash)
  }
  catch {
    // onError was already called inside uploadToS3 on failure
  }
}

function onCancel(): void {}

if (props.item.status === BaseFileUploadStatus.PENDING) {
  void uploadFile()
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
