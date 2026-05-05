import type { Component } from 'vue'

export interface InlineFieldWrapperProps {
  /**
   * The id of the associated input, used to generate the sr-only error message id.
   */
  id: string
  /**
   * Whether the field is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the field has an error.
   * @default false
   */
  isError?: boolean
  /**
   * Whether the field is loading.
   * @default false
   */
  isLoading?: boolean
  /**
   * Whether the field is read-only.
   * @default false
   */
  isReadonly?: boolean
  /**
   * The error message. Shown as tooltip on the error icon and announced to screen readers.
   * @default null
   */
  errorMessage?: string | null
  /**
   * The icon displayed on the left side.
   * @default null
   */
  iconLeft?: Component | null
  /**
   * The icon displayed on the right side.
   * @default null
   */
  iconRight?: Component | null
  /**
   * Accessible label rendered visually hidden (sr-only). Required for screen reader support.
   * @default null
   */
  label?: string | null
  /**
   * Visual variant matching the surface the field sits on.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary'
}
