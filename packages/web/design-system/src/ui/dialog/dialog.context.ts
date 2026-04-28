import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { CreateDialogStyle } from '@/ui/dialog/dialog.style'

interface DialogContext {
  isScrolledToBottom: Ref<boolean>
  isScrolledToTop: Ref<boolean>
  bodyRef: Ref<HTMLElement | null>
  style: Ref<CreateDialogStyle>
}

export const [
  useProvideDialogContext,
  useInjectDialogContext,
] = useContext<DialogContext>('dialogContext')
