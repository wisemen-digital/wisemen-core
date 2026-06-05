import type { Component } from 'vue'

import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export interface ButtonProps extends DisabledWithReason, WithKeyboardShortcut {
  /**
   * Shows a loading state and disables interaction.
   * @default false
   */
  isLoading?: boolean
  /**
   * The form ID the button is associated with.
   * @default null
   */
  form?: string | null
  /**
   * Icon displayed before the button label.
   * @default null
   */
  iconLeft?: Component | null
  /**
   * Icon displayed after the button label.
   * @default null
   */
  iconRight?: Component | null
  /**
   * Text label displayed inside the button.
   */
  label: string
  /**
   * Controls the button size.
   * @default 'md'
   */
  size?: 'lg' | 'md' | 'sm' | 'xs'
  /**
   * Tooltip text shown on hover or focus.
   * @default null
   */
  tooltipLabel?: string | null
  /**
   * Position of the tooltip relative to the button.
   * @default 'top'
   */
  tooltipSide?: 'bottom' | 'left' | 'right' | 'top'
  /**
   * Native button type attribute.
   *
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit'
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'destructive-primary' | 'destructive-secondary' | 'destructive-tertiary' | 'minimal-color' | 'primary' | 'secondary' | 'tertiary'
}
