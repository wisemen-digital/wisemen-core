import type { PopperProps } from '@/types/popper.type'

export interface PopoverProps extends PopperProps {
  /**
   * Disables flipping the popper to the opposite side when there is insufficient space.
   * @default false
   */
  disableSideFlip?: boolean
  /**
   * Disables updating the popper's position on layout shifts.
   * @default false
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the reference element, which might be undesirable.
   * @default false
   */
  prioritizePosition?: boolean
}
