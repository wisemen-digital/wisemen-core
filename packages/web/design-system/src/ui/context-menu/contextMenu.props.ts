export interface ContextMenuProps {
  /**
   * Lets the content grow wider than its default min-width to fit its
   * content. While open, it remembers the widest size it has rendered at so
   * it never shrinks back down again, preventing layout shifts when content
   * changes. This is reset each time the context menu is reopened.
   * @default false
   */
  isAdaptiveContentWidth?: boolean
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
   * @deprecated Use `isUpdateOnLayoutShiftDisabled` instead.
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * @deprecated Use `isPrioritizedPosition` instead.
   */
  prioritizePosition?: boolean

}
