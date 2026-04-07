import type { Component } from 'vue'

import type { DialogProps } from '@/ui/dialog/dialog.props'

export interface ConfirmDialogProps extends Pick<DialogProps, 'isOpen' | 'preventClickOutside' | 'preventEsc' | 'size'> {
  /**
   * The title displayed in the dialog header.
   */
  title: string

  /**
   * Whether the confirm button is disabled.
   * @default false
   */
  isConfirmDisabled?: boolean

  /**
   * Whether the confirm action is destructive. Makes the confirm button use the destructive-primary variant.
   * @default false
   */
  isDestructive?: boolean

  /**
   * Label for the cancel button.
   * @default 'Cancel'
   */
  cancelLabel?: string

  /**
   * Label for the confirm button.
   * @default 'Confirm'
   */
  confirmLabel?: string

  /**
   * The description displayed below the title in the dialog header.
   */
  description: string

  /**
   * Optional icon displayed in the header.
   * @default null
   */
  icon?: Component | null

  /**
   * Callback invoked when the cancel button is clicked.
   * @default null
   */
  onClose?: (() => void) | null

  /**
   * Callback invoked when the confirm button is clicked.
   * If it returns a Promise, the button will show a loading state until the Promise resolves.
   * @default null
   */
  onConfirm?: (() => Promise<void> | void) | null
}
