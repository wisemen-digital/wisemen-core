import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

export interface DropdownMenuActionItem extends Omit<MenuItemConfig, 'label'> {
  disabledReason?: string | null
}

export interface DropdownMenuSeparatorItem {
  type: 'separator'
}

export interface DropdownMenuSubMenuItem extends Omit<MenuItemConfig, 'label'> {
  filter?: boolean
  items: DropdownMenuItem[]
  label: string
  type: 'submenu'
}

export interface DropdownMenuCheckboxItem extends Omit<MenuItemConfig, 'label'> {
  checked: boolean
  disabledReason?: string | null
  label: string
  type: 'checkbox'

  onChange: (checked: boolean) => void
}

export interface DropdownMenuRadioOption extends Omit<MenuItemConfig, 'label'> {
  disabledReason?: string | null
  label: string
  value: string
}

export interface DropdownMenuRadioGroupItem {
  items: DropdownMenuRadioOption[]
  type: 'radio-group'
  value: string

  onChange: (value: string) => void
}

export interface DropdownMenuGroupItem {
  items: DropdownMenuItem[]
  label: string
  type: 'group'
}

export type DropdownMenuItem
  = DropdownMenuActionItem
    | DropdownMenuCheckboxItem
    | DropdownMenuGroupItem
    | DropdownMenuRadioGroupItem
    | DropdownMenuSeparatorItem
    | DropdownMenuSubMenuItem
