export enum BaseFileUploadError {
  INVALID_MIME_TYPE = 'INVALID_MIME_TYPE',
  PREPROCESSING_FAILED = 'PREPROCESSING_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

export interface BaseFileInfo {
  uuid: string
  name: string
  blurHash: string | null
  mimeType: string
  order: number
  url: string | null
}

export interface BaseFileUploadInfo {
  uuid: string
  uploadUrl: string
}

export enum BaseFileUploadStatus {
  ERROR = 'ERROR', // Upload failed
  PENDING = 'PENDING', // Awaiting `getFileInfo` response
  SUCCESS = 'SUCCESS', // Upload finished successfully
  UPLOADING = 'UPLOADING', // Upload in progress
}

interface BaseFileUploadItemBase {
  uuid: string
  isSyncedWithModelValue: boolean
  name: string
  // We need a stable key since the uuid can change after `getFileInfo`
  key: string
  mimeType: string
  order: number
  url: string | null
}

export interface BaseFileUploadItemPending extends BaseFileUploadItemBase {
  file: File
  status: BaseFileUploadStatus.PENDING
}

export interface BaseFileUploadItemUploading extends BaseFileUploadItemBase {
  file: File
  progress: number
  status: BaseFileUploadStatus.UPLOADING
}

export interface BaseFileUploadItemSuccess extends BaseFileUploadItemBase {
  blurHash: string | null
  status: BaseFileUploadStatus.SUCCESS
}

export interface BaseFileUploadItemError extends BaseFileUploadItemBase {
  errorMessage: string
  status: BaseFileUploadStatus.ERROR
}

export type BaseFileUploadItem
  = | BaseFileUploadItemError
    | BaseFileUploadItemPending
    | BaseFileUploadItemSuccess
    | BaseFileUploadItemUploading
