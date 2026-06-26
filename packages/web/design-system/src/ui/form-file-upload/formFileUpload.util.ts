import type { BaseFileUploadError } from '@/ui/base-file-upload'

export interface FormFileUploadErrorLabels {
  invalidType: string
  preprocessingFailed: string
  uploadFailed: string
}

export function getFormFileUploadErrorMessage(
  error: string | BaseFileUploadError,
  labels: FormFileUploadErrorLabels,
): string {
  switch (error) {
    case 'CONFIRM_UPLOAD_FAILED':
    case 'GET_FILE_INFO_FAILED':
    case 'UPLOAD_FAILED':
      return labels.uploadFailed
    case 'INVALID_MIME_TYPE':
      return labels.invalidType
    case 'PREPROCESSING_FAILED':
      return labels.preprocessingFailed
    default:
      return error
  }
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export function pickFormFileUploadTriggerAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([
      key,
    ]) => {
      return key === 'name'
        || key === 'onBlur'
        || key === 'onFocus'
        || key.startsWith('data-')
    }),
  )
}
