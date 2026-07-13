import type { PopperProps } from '@/types/popper.type'

export interface DropdownMenuProps extends PopperProps {
  /**
   * Lets the content grow wider than `min-w-48` to fit its content. While
   * open, it remembers the widest size it has rendered at so it never
   * shrinks back down again, preventing layout shifts when content changes.
   * This is reset each time the dropdown is reopened.
   * @default false
   */
  isAdaptiveContentWidth?: boolean
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

  /**
   * @deprecated Use `isUpdateOnLayoutShiftDisabled` instead.
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * @deprecated Use `isContentPositionFixed` instead.
   */
  fixedContentPosition?: boolean
  /**
   * @deprecated Use `isPrioritizedPosition` instead.
   */
  prioritizePosition?: boolean
}
