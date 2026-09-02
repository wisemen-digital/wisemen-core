import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import type { BaseFileUploadItem } from '@/ui/base-file-upload/baseFileUpload.type'

export interface BaseFileUploadProps extends DisabledWithReason {
  /**
   * If true, the uploaded file will be publicly accessible. This typically means that the file
   * will be uploaded with permissions that allow anyone to view or download it without authentication.
   *
   * @default false - The file will be uploaded with private permissions, requiring authentication for access.
   */
  isPublic?: boolean
  /**
   * A validator function that checks if a file is valid for upload.
   * This function is called before uploading a file to ensure that it meets the required criteria.
   * @param file - The file to be validated.
   * @returns `true` if the file is valid, or a string error message if the file is invalid.
   * @default null - No validation is performed.
   */
  isValidFile?: ((file: File) => string | true) | null
  /**
   * A unique file type specifier is a string that describes a type of file that may be selected by the user
   *
   * A valid case-insensitive filename extension, starting with a period (".") character.
   * For example: .jpg, .pdf, or .doc.
   *
   * A valid MIME type string, with no extensions.
   * The string audio/* meaning "any audio file".
   * The string video/* meaning "any video file".
   * The string image/* meaning "any image file".
   */
  accept: string[]
  /**
   * A preprocessing function that transforms a file before upload.
   * This function is called before uploading a file and can be used for operations like
   * image compression, format conversion, or metadata modification.
   * @param file - The file to be preprocessed.
   * @returns A promise that resolves to the transformed file.
   * @default null - No preprocessing is performed.
   */
  preprocess?: ((file: File) => Promise<File>) | null
}

export interface BaseFileUploadItemProps {
  item: BaseFileUploadItem
}
