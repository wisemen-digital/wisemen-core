export enum BaseFileUploadError {
  CONFIRM_UPLOAD_FAILED = 'CONFIRM_UPLOAD_FAILED',
  GET_FILE_INFO_FAILED = 'GET_FILE_INFO_FAILED',
  INVALID_MIME_TYPE = 'INVALID_MIME_TYPE',
  PREPROCESSING_FAILED = 'PREPROCESSING_FAILED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

export interface BaseFileUploadRejectedFile {
  error: string | BaseFileUploadError
  file: File
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

export interface BaseFileUploadAdapter {
  /**
   * Confirms the upload of a file. In the case of an image, a blur hash can be provided to
   * generate a placeholder while the image is being loaded.
   *
   * @param uuid - The unique identifier of the file being uploaded.
   * @param blurHash - The blur hash of the image, or `null` if not applicable.
   * @returns A promise that resolves when the upload is confirmed.
   */
  confirmUpload: (uuid: string, blurHash: string | null) => Promise<void>
  /**
   * Prepares a file for upload by retrieving upload metadata from the backend.
   *
   * This function is typically used before uploading a file to an external storage service
   * like Amazon S3. It returns the necessary information such as a pre-signed upload URL
   * and file UUID.
   *
   * @param name - The name of the file to be uploaded.
   * @param mimeType - The MIME type of the file to be uploaded.
   * @returns A promise that resolves to a `BaseFileUploadInfo` object containing upload metadata.
   */
  getFileInfo: (name: string, mimeType: string) => Promise<BaseFileUploadInfo>
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
  error: string | BaseFileUploadError
  status: BaseFileUploadStatus.ERROR
}

export type BaseFileUploadItem
  = | BaseFileUploadItemError
    | BaseFileUploadItemPending
    | BaseFileUploadItemSuccess
    | BaseFileUploadItemUploading
