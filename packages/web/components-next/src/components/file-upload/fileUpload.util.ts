import type {
  FileInfo,
  FileUploadItem,
} from '@/components/file-upload/fileUpload.type'
import { FileUploadStatus } from '@/components/file-upload/fileUpload.type'

export function mapFileToUploadItem(file: File, order: number, status = FileUploadStatus.PENDING): FileUploadItem {
  return {
    uuid: '',
    isSyncedWithModelValue: false,
    name: file.name,
    file,
    key: `${Math.random()}`,
    mimeType: file.type,
    order,
    status,
    url: URL.createObjectURL(file),
  } as FileUploadItem
}

export function mapFileInfoToFileUploadItem(fileInfo: FileInfo, status: FileUploadStatus): FileUploadItem {
  return {
    ...fileInfo,
    isSyncedWithModelValue: true,
    status,
  } as FileUploadItem
}
