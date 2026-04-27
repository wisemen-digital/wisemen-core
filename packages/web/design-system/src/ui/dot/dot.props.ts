export type DotColor = 'blue' | 'brand' | 'error' | 'gray' | 'pink' | 'purple' | 'success' | 'warning'

export type DotSize = 'lg' | 'md' | 'sm'

export interface DotProps {
  /**
   * The color of the dot.
   * @default 'gray'
   */
  color?: DotColor
  /**
   * The size of the dot.
   * @default 'md'
   */
  size?: DotSize
}
