import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { FormElement } from '@/utils/props.util'

export interface FormFieldProps extends FormElement, CustomizableElement<'formField'> {
  /**
   * The unique identifier of the associated form field.
   * This is typically used to link the label to the corresponding input element.
   */
  for: string
  /**
   *
   */
  layout?: 'horizontal' | 'vertical'
  /**
   * Defines the visual style of the form field.
   */
  variant?: GetComponentProp<'formField', 'variant'> | null
}
