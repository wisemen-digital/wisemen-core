import type { CountryCode } from 'libphonenumber-js'

import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { TextFieldProps } from '@/components/text-field/textField.props'

export interface PhoneNumberFieldProps extends Omit<TextFieldProps, 'classConfig' | 'isSpellcheckEnabled' | 'type'>, CustomizableElement<'phoneNumberField'> {
  /**
   * The default country code to use.
   * @default 'BE'
   */
  defaultCountryCode?: CountryCode
  /**
   * Defines the visual style of the input.
   */
  variant?: GetComponentProp<'phoneNumberField', 'variant'> | null
}
