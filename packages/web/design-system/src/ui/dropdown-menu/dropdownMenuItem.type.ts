import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

export interface DropdownMenuActionItem extends Omit<MenuItemConfig, 'label'> {
  disabledReason?: string | null
  label: string
  type: 'item'

  onSelect: () => void
}

export interface DropdownMenuSeparatorItem {
  type: 'separator'
}

export type DropdownMenuItem = DropdownMenuActionItem | DropdownMenuSeparatorItem
