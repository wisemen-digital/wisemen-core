import type { chinConfig } from '@/ui/dialog/dialogChin.composable'

export type DialogSize = 'full-screen' | 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxs'

export interface DialogProps {
  /**
   * The chin configuration to display below the dialog.
   * @default null
   */
  chin?: chinConfig | null
  /**
   *   Whether to show a close button in the dialog.
   * @default truw
   */
  hasCloseButton?: boolean
  /**
   * Whether to prevent closing the dialog by clicking outside.
   * @default false
   */
  preventClickOutside?: boolean

  /**
   * Whether to prevent closing the dialog by pressing Escape.
   * @default false
   */
  preventEsc?: boolean

  /**
   * The size of the dialog.
   * @default 'md'
   */
  size?: DialogSize
}
