import type { LayoutGap } from '@/ui/column-layout/columnLayout.props'

export interface RowLayoutProps {
  /**
   * Controls the vertical alignment of items within the row.
   * @default 'center'
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
   * Controls the horizontal distribution of items within the row.
   * @default 'start'
   */
  justify?: 'between' | 'center' | 'end' | 'start'
}
