export type LayoutGap = '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | '10xl' | '11xl' | 'lg' | 'md' | 'none' | 'sm' | 'xl' | 'xs' | 'xxs'

export interface ColumnLayoutProps {
  /**
   * Controls the vertical alignment of items within the column.
   * @default 'start'
   */
  align?: 'center' | 'end' | 'start'
  /**
   * The HTML element to render as the container.
   * @default 'div'
   */
  as?: string
  /**
   * Controls the spacing between items.
   * @default 'md'
   */
  gap?: LayoutGap
  /**
   * Controls the horizontal distribution of items within the column.
   * @default 'start'
   */
  justify?: 'between' | 'center' | 'end' | 'start'
}
