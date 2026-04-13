import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type { TestId } from '@/utils/props.util'

export interface BadgeProps extends TestId, CustomizableElement<'badge'> {
  /**
   * If true, a button will be visible to remove the badge.
   * @default false
   */
  isRemovable?: boolean
  /**
   * The color of the badge.
   */
  color: GetComponentProp<'badge', 'color'>
  /**
   * An icon to be displayed in the left side of badge.
   * @default null
   */
  icon?: Icon | null
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: GetComponentProp<'badge', 'size'>
  /**
   * The visual style of the badge.
   */
  variant: GetComponentProp<'badge', 'variant'>
}
