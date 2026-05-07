import type { Component } from 'vue'

import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import type { WithKeyboardShortcut } from '@/types/withKeyboardShortcut.type'

export interface IconButtonProps extends DisabledWithReason, WithKeyboardShortcut {
  /**
   * Shows a loading state and disables interaction.
   * @default false
   */
  isLoading?: boolean
  /**
   * Disables tooltip display.
   * @default false
   */
  isTooltipDisabled?: boolean
  /**
   * The form ID the button is associated with.
   * @default null
   */
  form?: string | null
  /**
   * Icon displayed inside the button.
   */
  icon: Component
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
   * Native button type attribute.
   *
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit'
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'destructive-primary' | 'destructive-tertiary' | 'primary' | 'secondary' | 'tertiary'
}
