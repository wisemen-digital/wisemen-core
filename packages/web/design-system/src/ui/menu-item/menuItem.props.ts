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
   * The label text displayed in the menu item.
   */
  label: string
  /**
   * The size of the menu item.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
