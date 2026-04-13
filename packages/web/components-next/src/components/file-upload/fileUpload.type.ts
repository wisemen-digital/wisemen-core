export enum FileUploadError {
  INVALID_MIME_TYPE = 'INVALID_MIME_TYPE',
  PREPROCESSING_FAILED = 'PREPROCESSING_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

export interface FileInfo {
  uuid: string
  name: string
  blurHash: string | null
  mimeType: string
  order: number
  url: string | null
}

export interface FileUploadInfo {
  uuid: string
  uploadUrl: string
}

export enum FileUploadStatus {
  ERROR = 'ERROR', // Upload failed
  PENDING = 'PENDING', // Awaiting `getFileInfo` response
  SUCCESS = 'SUCCESS', // Upload finished successfully
  UPLOADING = 'UPLOADING', // Upload in progress
}

interface BaseFileUploadItem {
  uuid: string
  isSyncedWithModelValue: boolean
  name: string
  // We need a stable key since the uuid can change after `getFileInfo`
  key: string
  mimeType: string
  order: number
  url: string | null
}

export interface FileUploadItemPending extends BaseFileUploadItem {
  file: File
  status: FileUploadStatus.PENDING
}

export interface FileUploadItemUploading extends BaseFileUploadItem {
  file: File
  progress: number
  status: FileUploadStatus.UPLOADING
}

export interface FileUploadItemSuccess extends BaseFileUploadItem {
  blurHash: string | null
  status: FileUploadStatus.SUCCESS
}

export interface FileUploadItemError extends BaseFileUploadItem {
  errorMessage: string
  status: FileUploadStatus.ERROR
}

export type FileUploadItem
  = | FileUploadItemError
    | FileUploadItemPending
    | FileUploadItemSuccess
    | FileUploadItemUploading
