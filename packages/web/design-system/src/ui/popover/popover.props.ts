import type { PopperProps } from '@/types/popper.type'

export interface PopoverProps extends PopperProps {
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the reference element, which might be undesirable.
   * @default false
   */
  isPrioritizedPosition?: boolean
  /**
   * Disables flipping the popper to the opposite side when there is insufficient space.
   * @default false
   */
  isSideFlipDisabled?: boolean
  /**
   * Disables updating the popper's position on layout shifts.
   * @default false
   */
  isUpdateOnLayoutShiftDisabled?: boolean

  /**
   * @deprecated Use `isSideFlipDisabled` instead.
   */
  disableSideFlip?: boolean
  /**
   * @deprecated Use `isUpdateOnLayoutShiftDisabled` instead.
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * @deprecated Use `isPrioritizedPosition` instead.
   */
  prioritizePosition?: boolean
}
