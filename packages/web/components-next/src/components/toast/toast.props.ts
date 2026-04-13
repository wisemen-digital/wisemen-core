import type {
  MaybeRefOrGetter,
  VNode,
} from 'vue'

import type { ButtonProps } from '@/components/button/default-button/button.props'
import type { Icon } from '@/icons/icons'
import type { TestId } from '@/utils/props.util'

export type ToastType = 'error' | 'info' | 'success'

export type PropsToMaybeRefOrGetter<T> = {
  [K in keyof T]: MaybeRefOrGetter<T[K]>
}

export interface ToastAction extends PropsToMaybeRefOrGetter<Omit<ButtonProps, 'onClick'>> {
  label: string
  onClick: (onClose: () => void) => void
}

export interface ToastProps extends TestId {
  /**
   * The main title of the toast.
   */
  title: string
  /**
   * One or more action buttons to display in the toast.
   * @default []
   */
  actions?: ToastAction[]
  /**
   * A description providing additional details.
   */
  description: string
  /**
   * The icon to display in the toast.
   * This will be ignored if a `preview` is provided.
   * If left unset and no preview is given, a default icon based on `type` is shown.
   */
  icon?: Icon | null
  /**
   * The preview to be displayed in the toast. If set, the icon will be replaced by this preview.
   * @default null
   */
  preview?: VNode | null
  /**
   * The type of toast. This will determine the icon and color of the toast.
   */
  type: ToastType
}
