export interface ContextMenuProps {
  /**
   * The padding between the context menu content and the collision boundaries.
   * @default 0
   */
  collisionPadding?: number
  /**
   * Disables updating the content's position on layout shifts.
   * @default false
   */
  disableUpdateOnLayoutShift?: boolean
  /**
   * Constrain the content to remain within the viewport. This may cause it
   * to overlap the trigger element, which might be undesirable.
   * @default false
   */
  prioritizePosition?: boolean
}
