import type { AcceptableValue } from 'reka-ui'

import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type {
  FormElement,
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export type CheckboxValue = AcceptableValue

export interface CheckboxProps extends TestId, InteractableElement, FormElement, CustomizableElement<'checkbox'> {
  /**
   * Whether the checkbox is indeterminate.
   * @default false
   */
  isIndeterminate?: boolean
  /**
   * The value of the checkbox. Only used when the checkbox is in a group.
   * @default null
   */
  value?: CheckboxValue
  /**
   * Defines the visual style of the checkbox.
   */
  variant?: GetComponentProp<'checkbox', 'variant'> | null
}
