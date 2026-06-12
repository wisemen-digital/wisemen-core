import type { HourCycle } from '@/types/hourCycle.type'
import type { NumberFormat } from '@/types/numberFormat.type'
import type { AddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.type'
import type { ToastAutoClose } from '@/ui/toast/toast.type'

export interface ConfigProviderProps {
  /**
   * The adapter to use for the AddressAutocomplete component.
   * Provide a getAddressByPlaceId() and a searchAddresses() function.
   * @default null
   */
  addressAutocompleteAdapter?: AddressAutocompleteAdapter | null
  /**
   * Controls when toasts automatically dismiss themselves.
   *
   * - `'always'` — all toasts close automatically after a timeout
   * - `'never'` — toasts persist until manually dismissed
   * - `'all-except-errors'` — only error toasts persist; all others auto-close
   *
   * @default 'always'
   */
  autoCloseToast: ToastAutoClose
  /**
   * The locale to use for date formatting in date-related components.
   * When not set, falls back to `navigator.language`.
   * @default null
   */
  dateLocale?: string | null
  /**
   * The Google Maps API key (used for example to validate addresses using the AddressAutocomplete component).
   * @default null
   */
  googleMapsApiKey?: string | null
  /**
   * The hour cycle to use for time-related components.
   * Can be either 'h12', 'h24' or 'locale-default'. If not provided, the system locale's default will be used.
   * @default null
   */
  hourCycle: HourCycle | null
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
  numberFormat: NumberFormat
  /**
   * The name of the project, used for example in the document title template.
   */
  projectName: string
  /**
   * When true, all animations in the design system run instantly.
   * Useful for accessibility (reduced motion preference) or testing.
   * Note: this also activates when the user has `prefers-reduced-motion: reduce` set on their OS.
   * @default false
   */
  reducedMotion?: boolean
  /*
   * Whether to show 'Back' and 'Forward' navigation arrows in the top bar
   * @default false
   */
  showNavigationArrowsInTopBar?: boolean
}
