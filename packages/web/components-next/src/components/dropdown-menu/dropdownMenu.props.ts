import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type { PopperPropsWithArrowVisibleByDefault } from '@/types/popperProps.type'
import type {
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface DropdownMenuProps extends TestId,
  InteractableElement,
  PopperPropsWithArrowVisibleByDefault,
  CustomizableElement<'dropdownMenu'> {
  /**
   * Defines the visual style of the dropdown menu.
   */
  variant?: GetComponentProp<'dropdownMenu', 'variant'> | null
}

export interface DropdownMenuItemProps extends TestId, InteractableElement {
  /**
   * Whether the item is destructive or dangerous.
   * @default false
   */
  isDestructive?: boolean
  /**
   * The icon of the item.
   * @default null
   */
  icon?: Icon | null
  /**
   * The label of the item.
   */
  label: string
}
