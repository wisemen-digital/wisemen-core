import type { ReferenceElement } from 'reka-ui'

export type PopperAlign = 'center' | 'end' | 'start'
export type PopperSide = 'bottom' | 'left' | 'right' | 'top'
export type PopperWidth = 'anchor-width' | 'available-width'

export interface PopperProps {
  /**
   * Controls the visibility of the popper arrow.
   * @default false
   */
  isPopoverArrowVisible?: boolean
  /**
   * Defines how the popper content is aligned relative to the trigger element.
   * Options are 'center', 'start', or 'end'.
   * @default 'center'
   */
  popoverAlign?: PopperAlign
  /**
   * An offset in pixels from the start or end alignment options.
   * @default 0
   */
  popoverAlignOffset?: number
  /**
   * The HTML element that serves as the anchor point for the popover.
   * If set to `null`, the popover will be anchored to the trigger element.
   * @default null
   */
  popoverAnchorReferenceElement?: ReferenceElement | null
  /**
   * When specified, applies the given animation name to the popper content.
   * This allows for custom animations to be used when showing or hiding the popper.
   * @default null
   */
  popoverAnimationName?: string | null
  /**
   * Specifies the padding (in pixels) used when handling collision detection.
   * A larger value increases the spacing between the popper and the container edges.
   * @default 0
   */
  popoverCollisionPadding?: number
  /**
   * The HTML element in which the popper content should be rendered.
   * By default, the popper content is rendered inside the viewport.
   * @default null
   */
  popoverContainerElement?: HTMLElement | null
  /**
   * Defines which side the content should appear on.
   * Options are 'top', 'right', 'bottom', or 'left'.
   * @default 'top'
   */
  popoverSide?: PopperSide
  /**
   * The distance in pixels between the popper content and the trigger element.
   * @default 0
   */
  popoverSideOffset?: number
  /**
   * Determines the width of the popper content.
   * - `anchor-width`: Matches the width of the trigger element.
   * - `available-width`: Expands to fit the available space.
   * - `null`: Uses the natural width of the content.
   * @default null
   */
  popoverWidth?: PopperWidth | null
}

export const POPPER_PROPS_DEFAULTS = {
  isPopoverArrowVisible: false,
  popoverAlign: 'center',
  popoverAlignOffset: 0,
  popoverAnchorReferenceElement: null,
  popoverAnimationName: null,
  popoverCollisionPadding: 0,
  popoverContainerElement: null,
  popoverSide: 'top',
  popoverSideOffset: 0,
  popoverWidth: null,
} satisfies PopperProps
