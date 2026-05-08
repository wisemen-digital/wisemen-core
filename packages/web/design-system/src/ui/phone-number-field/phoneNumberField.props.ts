import type { CountryCode } from 'libphonenumber-js'

import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface PhoneNumberFieldProps extends Input, AutocompleteInput, InputWrapper, FieldWrapper {
  /**
   * Default country code when no initial value is provided or the value cannot be parsed.
   * @default 'BE'
   */
  defaultCountryCode?: CountryCode
  /**
   * Country codes shown at the top of the dropdown, separated from the rest by a divider.
   * Shown in the order provided.
   * @default []
   */
  preferredCountryCodes?: CountryCode[]
  /**
   * The size of the field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
