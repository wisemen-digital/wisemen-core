import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type {
  FormElement,
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface SwitchProps extends TestId, InteractableElement, FormElement, CustomizableElement<'switch'> {
  /**
   * The icon to be displayed when the switch is checked.
   * @default null
   */
  iconChecked?: Icon | null
  /**
   * The icon to be displayed when the switch is unchecked.
   * @default null
   */
  iconUnchecked?: Icon | null
  /**
   * Defines the size of the switch.
   * @default 'md'
   */
  size?: GetComponentProp<'switch', 'size'>
  /**
   * Defines the visual style of the switch.
   */
  variant?: GetComponentProp<'switch', 'variant'> | null
}
