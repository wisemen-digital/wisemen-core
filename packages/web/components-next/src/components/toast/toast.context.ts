import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { ToastProps } from '@/components/toast/toast.props'
import type { CreateToastStyle } from '@/components/toast/toast.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface ToastContext extends PropsToComputed<ToastProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'toast'>>
  style: ComputedRef<CreateToastStyle>
  onClose: () => void
}

export const [
  useProvideToastContext,
  useInjectToastContext,
] = useContext<ToastContext>('toastContext')
