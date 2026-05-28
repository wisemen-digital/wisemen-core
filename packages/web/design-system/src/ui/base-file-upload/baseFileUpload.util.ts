import type {
  BaseFileInfo,
  BaseFileUploadItem,
} from '@/ui/base-file-upload/baseFileUpload.type'
import { BaseFileUploadStatus } from '@/ui/base-file-upload/baseFileUpload.type'

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
