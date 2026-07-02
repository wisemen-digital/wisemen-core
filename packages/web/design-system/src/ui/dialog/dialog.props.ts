import type { ChinConfig } from '@/ui/dialog/dialogChin.composable'

export type DialogSize = 'full-screen' | 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxs'

export interface DialogProps {
  /**
   * The chin configuration to display below the dialog.
   * @default null
   */
  chin?: ChinConfig | null
  /**
   * Whether to prevent closing the dialog by clicking outside.
   * @default false
   */
  isClickOutsideDisabled?: boolean
  /**
   * Whether to prevent closing the dialog by pressing Escape.
   * @default false
   */
  isEscDisabled?: boolean

  /**
   *   Whether to show a close button in the dialog.
   * @default true
   */
  hasCloseButton?: boolean

  /**
   * The size of the dialog.
   * @default 'md'
   */
  size?: DialogSize
}
