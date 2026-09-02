import type {
  FileResponse,
  PresignedFileResponse,
} from '@/models/file-reference/fileReference.dto'
import { MimeType } from '@/models/file-reference/fileReference.dto'
import type {
  FileReference,
  PresignedFileReference,
} from '@/models/file-reference/fileReference.model'
import type { BaseFileInfo } from '@/ui/base-file-upload'

export class FileReferenceTransformer {
  static fromDto(dto: FileResponse): FileReference
  static fromDto(dto: null): null
  static fromDto(dto: FileResponse | null): FileReference | null
  static fromDto(dto: FileResponse | null): FileReference | null {
    if (dto === null) {
      return null
    }

    return {
      uuid: dto.uuid,
      name: dto.name,
      blurHash: dto.blurHash,
      mimeType: dto.mimeType ?? MimeType.TEXT_PLAIN,
    }
  }

  static toDto(file: BaseFileInfo): string
  static toDto(file: null): null
  static toDto(file: BaseFileInfo | null): string | null
  static toDto(file: BaseFileInfo | null): string | null {
    return file === null ? null : file.uuid
  }

  static toForm(file: FileReference): BaseFileInfo
  static toForm(file: null): null
  static toForm(file: FileReference | null): BaseFileInfo | null
  static toForm(file: FileReference | null): BaseFileInfo | null {
    if (file === null) {
      return null
    }

    return {
      uuid: file.uuid,
      name: file.name,
      blurHash: file.blurHash,
      mimeType: file.mimeType,
      order: 0,
      url: '',
    }
  }
}

export class PresignedFileReferenceTransformer {
  static fromDto(dto: PresignedFileResponse): PresignedFileReference
  static fromDto(dto: null): null
  static fromDto(dto: PresignedFileResponse | null): PresignedFileReference | null
  static fromDto(dto: PresignedFileResponse | null): PresignedFileReference | null {
    if (dto === null) {
      return null
    }

    return {
      ...FileReferenceTransformer.fromDto({
        ...dto,
        mimeType: dto.mimeType ?? MimeType.TEXT_PLAIN,
      }),
      url: dto.url,
      variants: dto.variants.map((variant) => ({
        label: variant.label,
        url: variant.url,
      })),
    }
  }

  static toDto(file: BaseFileInfo): string
  static toDto(file: null): null
  static toDto(file: BaseFileInfo | null): string | null
  static toDto(file: BaseFileInfo | null): string | null {
    return file === null ? null : file.uuid
  }

  static toForm(file: PresignedFileReference): BaseFileInfo
  static toForm(file: null): null
  static toForm(file: PresignedFileReference | null): BaseFileInfo | null
  static toForm(file: PresignedFileReference | null): BaseFileInfo | null {
    if (file === null) {
      return null
    }

    return {
      uuid: file.uuid,
      name: file.name,
      blurHash: file.blurHash,
      mimeType: file.mimeType,
      order: 0,
      url: file.url,
    }
  }
}
