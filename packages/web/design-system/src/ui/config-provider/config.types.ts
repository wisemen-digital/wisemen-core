import type { HourCycle } from '@/types/hourCycle.type'
import type { NumberSeparatorStyle } from '@/types/numberSeparatorStyle.type'
import type { AddressAutocompleteAdapter } from '@/ui/address-autocomplete'

export interface ConfigProviderProps {
  /**
   * The adapter to use for the AddressAutocomplete component.
   * Provide a getAddressByPlaceId() and a searchAddresses() function.
   * @default null
   */
  addressAutocompleteAdapter?: AddressAutocompleteAdapter | null
  /**
   * The Google Maps API key (used for example to validate addresses using the AddressAutocomplete component).
   * @default null
   */
  googleMapsApiKey?: string | null
  /**
   * The hour cycle to use for time-related components.
   * Can be either 'h12' or 'h24'. If not provided, the system locale's default will be used.
   * @default null
   */
  hourCycle?: HourCycle
  /**
   * The locale to use for localization.
   */
  locale: string
  /**
   * Controls the thousands and decimal separator style used in NumberField components.
   * When not set (or `'system'`), the browser/OS locale determines the separators.
   *
   * - `'period-comma'` → 1.234.567,89
   * - `'comma-period'` → 1,234,567.89
   * - `'space-period'`  → 1 234 567.89
   * - `'space-comma'`   → 1 234 567,89
   *
   * @default 'system'
   */
  numberSeparatorStyle?: NumberSeparatorStyle
  /**
   * The selector for the teleport target.
   * @default 'body'
   */
  teleportTargetSelector?: string
}
