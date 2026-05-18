export interface FormFieldGridProps {
  /**
   * Number of columns at large container width.
   */
  lg: 1 | 2 | 3

  /**
   * Number of columns at medium container width.
   * @default 1
   */
  md?: 1 | 2 | 3

  /**
   * Number of columns at small container width.
   */
  sm: 1 | 2 | 3

  /**
   * Visual style of the grid container.
   * Use `card` to wrap fields in a surface with padding and rounded corners.
   * @default 'ghost'
   */
  variant?: 'card' | 'ghost'
}
