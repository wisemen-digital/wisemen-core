import type {
  BaseFileInfo,
  BaseFileUploadItem,
} from '@/ui/base-file-upload/baseFileUpload.type'
import { BaseFileUploadStatus } from '@/ui/base-file-upload/baseFileUpload.type'

const FILE_PATH_SPLIT_REGEX = /[/\\]/

export function mapFileToBaseUploadItem(
  file: File,
  order: number,
  status = BaseFileUploadStatus.PENDING,
): BaseFileUploadItem {
  return {
    uuid: '',
    isSyncedWithModelValue: false,
    name: file.name,
    file,
    key: crypto.randomUUID(),
    mimeType: file.type,
    order,
    status,
    url: URL.createObjectURL(file),
  } as BaseFileUploadItem
}

export function mapFileInfoToBaseFileUploadItem(
  fileInfo: BaseFileInfo,
  status: BaseFileUploadStatus,
): BaseFileUploadItem {
  return {
    ...fileInfo,
    isSyncedWithModelValue: true,
    status,
  } as BaseFileUploadItem
}

export function isValidMimeType(file: Pick<File, 'type'>, allowedTypes: string[]): boolean {
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

export function getExtensionFromMimeType(mimeType: string): string {
  return mimeType.split('/')[1] ?? 'bin'
}

export async function getBlobFingerprint(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function getFileNameFromClipboardItem(
  clipboardItem: ClipboardItem,
  mimeType: string,
): Promise<string> {
  if (clipboardItem.types.includes('text/plain')) {
    try {
      const textBlob = await clipboardItem.getType('text/plain')
      const textContent = await textBlob.text()
      const text = textContent.trim()
      const fileName = text.split(FILE_PATH_SPLIT_REGEX).pop()

      if (fileName !== undefined && fileName.includes('.')) {
        return fileName
      }
    }
    catch {
      // ignore — text/plain may exist in types but still fail to read
    }
  }

  return `clipboard.${getExtensionFromMimeType(mimeType)}`
}
