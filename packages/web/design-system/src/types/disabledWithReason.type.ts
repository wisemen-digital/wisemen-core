/**
 * Shared properties for elements that can be disabled with an optional reason.
 * When `isDisabled` is `true` and `disabledReason` is provided,
 * a tooltip will be shown on hover with the provided text.
 */
export interface DisabledWithReason {
  /**
   * Determines whether the element is disabled. When `true`, the element becomes non-interactive.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Provides a reason why the element is disabled,
   * when provided a tooltip will be shown on hover with the provided text.
   * @default null
   */
  disabledReason?: string | null
}

export const DISABLED_WITH_REASON_DEFAULTS = {
  isDisabled: false,
  disabledReason: null,
} satisfies DisabledWithReason
