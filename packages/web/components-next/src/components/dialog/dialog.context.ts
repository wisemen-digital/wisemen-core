import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DialogProps } from '@/components/dialog/dialog.props'
import type { CreateDialogStyle } from '@/components/dialog/dialog.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface DialogContext extends PropsToComputed<DialogProps> {
  isOpen: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'dialog'>>
  style: ComputedRef<CreateDialogStyle>
}

export const [
  useProvideDialogContext,
  useInjectDialogContext,
] = useContext<DialogContext>('dialogContext')
