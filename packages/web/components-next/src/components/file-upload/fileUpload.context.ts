import type { ComputedRef } from 'vue'

import type { FileUploadProps } from '@/components/file-upload/fileUpload.props'
import type {
  FileUploadError,
  FileUploadItem,
} from '@/components/file-upload/fileUpload.type'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface FileUploadContext extends PropsToComputed<Omit<FileUploadProps, 'preprocess'>> {
  isMultiple: ComputedRef<boolean>
  preprocess: ((file: File) => Promise<File>) | null
  onError: (fileUploadItem: FileUploadItem, error: FileUploadError) => void
  onFilesSelected: (files: File[]) => void
  onRemoveFileUploadItem: (fileUploadItem: FileUploadItem) => void
  onReplaceFileUploadItem: (fileUploadItem: FileUploadItem, file: File) => void
  onStartUpload: (fileUploadItem: FileUploadItem, uuid: string) => void
  onSuccess: (fileUploadItem: FileUploadItem) => void
  onUpdateProgress: (fileUploadItem: FileUploadItem, progress: number) => void
}

export const [
  useProvideFileUploadContext,
  useInjectFileUploadContext,
] = useContext<FileUploadContext>('fileUploadContext')
