import type { MenuItemConfig } from './menuItem.type'

export interface MenuItemProps {
  /**
   * Disable this menu item.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Configuration object for content layout (left, description, right).
   */
  config?: MenuItemConfig | null
  /**
   * When provided, the item is visually disabled and a tooltip is shown with this text explaining why.
   * @default null
   */
  disabledReason?: string | null
  /**
   * The label text displayed in the menu item.
   */
  label: string
  /**
   * The size of the menu item.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
