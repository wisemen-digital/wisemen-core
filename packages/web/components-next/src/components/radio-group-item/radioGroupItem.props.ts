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

export type RadioGroupItemValue = AcceptableValue

export interface RadioGroupItemProps extends TestId, InteractableElement, FormElement, CustomizableElement<'radioGroupItem'> {
  /**
   * The value of the radio group item.
   */
  value: RadioGroupItemValue
  /**
   * Defines the visual style of the radio group item.
   */
  variant?: GetComponentProp<'radioGroupItem', 'variant'> | null
}
