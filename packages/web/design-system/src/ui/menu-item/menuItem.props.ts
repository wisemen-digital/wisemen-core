import type { MenuItemConfig } from './menuItem.type'

export interface MenuItemProps {
  /**
   * Configuration object for advanced content layout (avatar, icon, description, right content).
   */
  config?: MenuItemConfig | null
  /**
   * The label text displayed in the menu item. Falls back to `config.label` when not provided.
   */
  label?: string | null
  /**
   * The size of the menu item.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
