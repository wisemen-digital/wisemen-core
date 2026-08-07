import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { CreateDialogStyle } from '@/ui/dialog/dialog.style'

interface DialogContext {
  hasOpenNestedLayer: Ref<boolean>
  isScrolledToBottom: Ref<boolean>
  isScrolledToTop: Ref<boolean>
  bodyRef: Ref<HTMLElement | null>
  registerNestedLayer: () => void
  style: Ref<CreateDialogStyle>
  unregisterNestedLayer: () => void
}

export const [
  useProvideDialogContext,
  useInjectDialogContext,
] = useContext<DialogContext>('dialogContext')
