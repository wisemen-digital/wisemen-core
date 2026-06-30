import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { BaseFileUploadItem } from '@/ui/base-file-upload/baseFileUpload.type'

interface BaseFileUploadItemContext {
  item: ComputedRef<BaseFileUploadItem>
  onCancel: () => void
  onRemove: () => void
  onReplace: (file: File) => void
}

export const [
  useProvideBaseFileUploadItemContext,
  useInjectBaseFileUploadItemContext,
] = useContext<BaseFileUploadItemContext>('baseFileUploadItemContext')
