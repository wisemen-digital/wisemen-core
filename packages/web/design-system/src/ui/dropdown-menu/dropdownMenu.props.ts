import type { PopperProps } from '@/types/popper.type'

export interface DropdownMenuProps extends PopperProps {
  /**
   * When enabled, snapshots the trigger's position the moment the dropdown opens
   * and anchors the content there for the duration it is open. Prevents the
   * dropdown from jumping when the trigger moves
   * @default false
   */
  isContentPositionFixed?: boolean
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the reference element, which might be undesirable.
   * @default false
   */
  isPrioritizedPosition?: boolean
  /**
   * Disables updating the popper's position on layout shifts.
   * @default false
   */
  isUpdateOnLayoutShiftDisabled?: boolean
}
