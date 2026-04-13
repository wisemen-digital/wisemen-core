import type {
  DropdownMenuItemProps,
  DropdownMenuProps,
} from '@/components/dropdown-menu/dropdownMenu.props'

export type VcDropdownMenuItemProps = DropdownMenuItemProps
export type VcDropdownMenuProps = Omit<DropdownMenuProps, 'classConfig' | 'variant'>
export { createDropdownMenuStyle } from '@/components/dropdown-menu/dropdownMenu.style'
export { default as VcDropdownMenu } from '@/components/dropdown-menu/DropdownMenu.vue'
export { default as VcDropdownMenuArrow } from '@/components/dropdown-menu/parts/DropdownMenuArrow.vue'
export { default as VcDropdownMenuContent } from '@/components/dropdown-menu/parts/DropdownMenuContent.vue'
export { default as VcDropdownMenuContentTransition } from '@/components/dropdown-menu/parts/DropdownMenuContentTransition.vue'
export { default as VcDropdownMenuGroup } from '@/components/dropdown-menu/parts/DropdownMenuGroup.vue'
export { default as VcDropdownMenuItem } from '@/components/dropdown-menu/parts/DropdownMenuItem.vue'
export { default as VcDropdownMenuItemIcon } from '@/components/dropdown-menu/parts/DropdownMenuItemIcon.vue'
export { default as VcDropdownMenuItemLabel } from '@/components/dropdown-menu/parts/DropdownMenuItemLabel.vue'
export { default as VcDropdownMenuPortal } from '@/components/dropdown-menu/parts/DropdownMenuPortal.vue'
export { default as VcDropdownMenuRoot } from '@/components/dropdown-menu/parts/DropdownMenuRoot.vue'
export { default as VcDropdownMenuSeparator } from '@/components/dropdown-menu/parts/DropdownMenuSeparator.vue'
export { default as VcDropdownMenuSubMenu } from '@/components/dropdown-menu/parts/DropdownMenuSubMenu.vue'
export { default as VcDropdownMenuSubMenuTransition } from '@/components/dropdown-menu/parts/DropdownMenuSubMenuTransition.vue'
export { default as VcDropdownMenuTrigger } from '@/components/dropdown-menu/parts/DropdownMenuTrigger.vue'
