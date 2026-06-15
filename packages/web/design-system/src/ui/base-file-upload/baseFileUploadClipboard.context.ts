import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'

interface BaseFileUploadClipboardContext {
  files: ComputedRef<File[]>
  clear: () => void
  upload: () => void
}

export const [
  useProvideBaseFileUploadClipboardContext,
  useInjectBaseFileUploadClipboardContext,
] = useContext<BaseFileUploadClipboardContext>('baseFileUploadClipboardContext')
