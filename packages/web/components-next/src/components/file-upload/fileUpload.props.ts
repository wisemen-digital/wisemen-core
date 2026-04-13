import type {
  FileUploadInfo,
  FileUploadItem,
} from '@/components/file-upload/fileUpload.type'
import type { InteractableElement } from '@/utils/props.util'

export interface FileUploadProps extends InteractableElement {
  /*
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
   * @returns A boolean indicating whether the file is valid or not.
   * @default null - No validation is performed.
   */
  isValidFile?: ((file: File) => boolean) | null
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
   * Confirms the upload of a file. In the case of a image, a blur hash can be provided to
   * generate a placeholder while the image is being uploaded.
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
   * like Amazon S3. It returns the necessary information such as a pre-signed upload URL,
   * file UUID, and MIME type.
   *
   * @param name - The name of the file to be uploaded.
   * @param mimeType - The MIME type of the file to be uploaded.
   * @returns A promise that resolves to a `FileInfo` object containing upload metadata.
   */
  getFileInfo: (name: string, mimeType: string) => Promise<FileUploadInfo>
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

export interface FileUploadItemProps {
  item: FileUploadItem
}
