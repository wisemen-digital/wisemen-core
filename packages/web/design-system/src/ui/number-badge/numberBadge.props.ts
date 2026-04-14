import type { UtilityColor } from '@/types/utilityColor.type'

export interface NumberBadgeProps {
  /**
   * Accessible label for screen readers. When null, the badge value is used.
   */
  ariaLabel?: string | null
  /**
   * The color of the badge.
   * @default 'gray'
   */
  color?: UtilityColor
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: 'lg' | 'md'
  /**
   * The number to display inside the badge. always use a formatted string here (e.g. 1.400, 4,5)
   */
  value: string
  /**
   * The visual style variant of the badge.
   * @default 'translucent'
   */
  variant?: 'outline' | 'solid' | 'translucent'
}
