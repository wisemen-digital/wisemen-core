import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { TestId } from '@/utils/props.util'

export interface DialogProps extends TestId, CustomizableElement<'dialog'> {
  /**
   * The ID of the element to teleport the dialog content to.
   * By default, the dialog content is teleported to the body.
   * Should be without the leading `#`.
   * @default null
   */
  teleportTargetId?: string | null
  /**
   * Whether to hide the overlay.
   * @default false
   */
  hideOverlay?: boolean
  /**
   * Prevent clicks outside the dialog content to close the dialog.
   * @default false
   */
  preventClickOutside?: boolean
  /**
   * Prevent pressing the ESC key to close the dialog.
   * @default false
   */
  preventEsc?: boolean
  /**
   * Defines the visual style of the dialog.
   */
  variant?: GetComponentProp<'dialog', 'variant'> | null
}
