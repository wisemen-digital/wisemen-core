export interface FormFieldSetProps {
  /**
   * Title displayed at the start of the fieldset.
   */
  title: string

  /**
   * When `true`, the title and fields are stacked vertically with a separator instead of being placed side-by-side.
   * @default false
   */
  isStacked?: boolean

  /**
   * Optional description rendered below the title.
   * @default null
   */
  description?: string | null

  /**
   * Horizontal alignment of the fields slot content.
   * @default 'start'
   */
  horizontalAlignment?: 'end' | 'start'

  /**
   * Visual style of the fieldset container.
   * Use `card` to wrap the fieldset in a surface with padding and rounded corners.
   * @default 'ghost'
   */
  variant?: 'card' | 'ghost'
}
