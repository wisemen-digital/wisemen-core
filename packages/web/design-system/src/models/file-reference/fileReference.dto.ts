export enum MimeType {
  APPLICATION_MSWORD = 'application/msword',
  APPLICATION_OCTET_STREAM = 'application/octet-stream',
  APPLICATION_PDF = 'application/pdf',
  APPLICATION_VND_MS_POWERPOINT = 'application/vnd.ms-powerpoint',
  APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  APPLICATION_VND_OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  IMAGE_BMP = 'image/bmp',
  IMAGE_GIF = 'image/gif',
  IMAGE_HEIC = 'image/heic',
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_TIFF = 'image/tiff',
  IMAGE_WEBP = 'image/webp',
  TEXT_CSV = 'text/csv',
  TEXT_HTML = 'text/html',
  TEXT_PLAIN = 'text/plain',
}

export interface CreateFileResponse {
  uuid: string
  name: string
  mimeType: MimeType | null
  uploadUrl: string
}

export interface FileResponse {
  uuid: string
  name: string
  blurHash: string | null
  mimeType: MimeType
}

export interface PresignedFileVariantResponse {
  label: string
  url: string
}

export interface PresignedFileResponse {
  uuid: string
  name: string
  blurHash: string | null
  mimeType: MimeType | null
  url: string
  variants: Array<PresignedFileVariantResponse>
}
