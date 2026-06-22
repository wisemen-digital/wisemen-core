import type { MimeType } from '@/models/file-reference/fileReference.dto'

export interface FileReference {
  uuid: string
  name: string
  blurHash: string | null
  mimeType: MimeType
}

export interface PresignedFileReference extends FileReference {
  url: string
  variants: {
    label: string
    url: string
  }[]
}
