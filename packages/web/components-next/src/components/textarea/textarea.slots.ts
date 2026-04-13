import type { FormFieldSlots } from '@/components/form-field/formField.slots'

export interface TextareaSlots extends FormFieldSlots {
  /**
   * Content to be displayed on the bottom of the textarea
   */
  bottom: () => unknown
  /**
   * Content to be displayed on the top of the textarea
   */
  top: () => unknown
}
