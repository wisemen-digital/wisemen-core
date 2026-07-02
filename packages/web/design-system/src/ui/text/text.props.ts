export interface TextProps {
  /**
   * If `true`, the tooltip will be disabled even if the text is truncated.
   * @default false
   */
  isTooltipDisabled?: boolean
  /**
   * The HTML element or component to render as the text container.
   * @default 'span'
   */
  as?: string
  /**
   * Additional CSS classes to apply to the text element.
   * @default null
   */
  class?: string | null
  /**
   * @deprecated Use `isTooltipDisabled` instead.
   */
  disableTooltip?: boolean
  /**
   * The text content to display.
   */
  text: string

  /**
   * If `true`, the text will be truncated with an ellipsis if it overflows its container.
   * If a number between 2 and 6 is provided, the text will be clamped to that number of lines.
   * @default true
   */
  truncate?: boolean | 2 | 3 | 4 | 5 | 6
}
