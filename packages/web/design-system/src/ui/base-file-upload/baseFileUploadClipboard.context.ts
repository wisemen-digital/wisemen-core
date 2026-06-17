import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'

interface BaseFileUploadClipboardContext {
  clear: () => void
  files: ComputedRef<File[]>
  upload: () => void
}

export const [
  useProvideBaseFileUploadClipboardContext,
  useInjectBaseFileUploadClipboardContext,
] = useContext<BaseFileUploadClipboardContext>('baseFileUploadClipboardContext')
