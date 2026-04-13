import type { ComputedRef } from 'vue'

import type { FileUploadItem } from '@/components/file-upload/fileUpload.type'
import { useContext } from '@/composables/context/context.composable'

interface FileUploadItemContext {
  item: ComputedRef<FileUploadItem>
  onCancel: () => void
  onRemove: () => void
  onReplace: (file: File) => void
}

export const [
  useProvideFileUploadItemContext,
  useInjectFileUploadItemContext,
] = useContext<FileUploadItemContext>('fileUploadItemContext')
