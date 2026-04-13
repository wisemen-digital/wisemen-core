<script setup lang="ts">
import { computed } from 'vue'

import { BlurhashUtil } from '@/components/file-upload/blurhash.util'
import { useInjectFileUploadContext } from '@/components/file-upload/fileUpload.context'
import type {
  FileUploadInfo,
  FileUploadItem,
  FileUploadItemPending,
} from '@/components/file-upload/fileUpload.type'
import {
  FileUploadError,
  FileUploadStatus,
} from '@/components/file-upload/fileUpload.type'
import { useProvideFileUploadItemContext } from '@/components/file-upload/fileUploadItem.context'

const props = defineProps<{
  item: FileUploadItem
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
} = useInjectFileUploadContext()

async function getFileInfoData(): Promise<FileUploadInfo | null> {
  const {
    name, mimeType,
  } = props.item

  try {
    return await getFileInfo(name, mimeType)
  }
  catch {
    onError(props.item, FileUploadError.UPLOAD_FAILED)
  }

  return null
}

function uploadToS3(uuid: string, url: string, file: File): void {
  onStartUpload(props.item, uuid)

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
    }
    else {
      onError(props.item, FileUploadError.UPLOAD_FAILED)
    }
  }

  xhr.onerror = (): void => {
    onError(props.item, FileUploadError.UPLOAD_FAILED)
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
  } = props.item as FileUploadItemPending

  let processedFile = file

  if (preprocess !== null) {
    try {
      processedFile = await preprocess(file)
    }
    catch {
      onError(props.item, FileUploadError.PREPROCESSING_FAILED)

      return
    }
  }

  void uploadToS3(uuid, uploadUrl, processedFile)
  void confirmUpload(uuid, await BlurhashUtil.encode(processedFile))
}

function onCancel(): void {}

if (props.item.status === FileUploadStatus.PENDING) {
  void uploadFile()
}

useProvideFileUploadItemContext({
  item: computed<FileUploadItem>(() => props.item),
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
