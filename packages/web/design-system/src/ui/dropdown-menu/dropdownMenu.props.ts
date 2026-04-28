import type { PopperProps } from '@/types/popper.type'
import type { DropdownMenuItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'

export interface DropdownMenuProps extends PopperProps {
  /**
   * Disables updating the popper's position on layout shifts.
   * @default false
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * When true, renders a filter input at the top of the menu that filters items by label.
   * @default false
   */
  filter?: boolean
  /**
   * Programmatic list of items to render. Supports action items, separators, and submenus.
   * Can be used alongside the content slot.
   */
  items?: DropdownMenuItem[] | null
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the reference element, which might be undesirable.
   * @default false
   */
  prioritizePosition?: boolean
}
