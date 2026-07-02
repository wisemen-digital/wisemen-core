export interface ContextMenuProps {
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the trigger element, which might be undesirable.
   * @default false
   */
  isPrioritizedPosition?: boolean
  /**
   * Disables updating the content's position on layout shifts.
   * @default false
   */
  isUpdateOnLayoutShiftDisabled?: boolean
  /**
   * The padding between the context menu content and the collision boundaries.
   * @default 0
   */
  collisionPadding?: number

  /**
   * @deprecated Use `isPrioritizedPosition` instead.
   */
  prioritizePosition?: boolean
  /**
   * @deprecated Use `isUpdateOnLayoutShiftDisabled` instead.
   */
  disableUpdateOnLayoutShift?: boolean
}
