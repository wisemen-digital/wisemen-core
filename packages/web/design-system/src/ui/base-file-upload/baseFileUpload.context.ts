import type { ComputedRef } from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type { BaseFileUploadProps } from '@/ui/base-file-upload/baseFileUpload.props'
import type {
  BaseFileUploadError,
  BaseFileUploadItem,
  BaseFileUploadItemSuccess,
} from '@/ui/base-file-upload/baseFileUpload.type'

interface BaseFileUploadContext extends PropsToComputed<Omit<BaseFileUploadProps, 'preprocess'>> {
  hasDownloadListener: ComputedRef<boolean>
  isMultiple: ComputedRef<boolean>
  preprocess: ((file: File) => Promise<File>) | null
  onError: (item: BaseFileUploadItem, error: string | BaseFileUploadError) => void
  onDownload: (item: BaseFileUploadItemSuccess) => void
  onFilesSelected: (files: File[]) => void
  onRemoveFileUploadItem: (item: BaseFileUploadItem) => void
  onReplaceFileUploadItem: (item: BaseFileUploadItem, file: File) => void
  onStartUpload: (item: BaseFileUploadItem, uuid: string) => void
  onSuccess: (item: BaseFileUploadItem) => void
  onUpdateProgress: (item: BaseFileUploadItem, progress: number) => void
}

export const [
  useProvideBaseFileUploadContext,
  useInjectBaseFileUploadContext,
] = useContext<BaseFileUploadContext>('baseFileUploadContext')
