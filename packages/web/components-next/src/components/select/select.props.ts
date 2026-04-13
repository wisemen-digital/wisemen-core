import type { AcceptableValue } from 'reka-ui'

import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type { PopperPropsWithArrowHiddenByDefault } from '@/types/popperProps.type'
import type {
  FormElement,
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export type SelectValue = AcceptableValue | AcceptableValue[]

export type SelectFilterFn<TValue extends SelectValue> = (
  option: TValue extends Array<infer U> ? U : NonNullable<TValue>,
  searchTerm: string,
) => boolean

export type SelectDisplayFn<TValue extends SelectValue> = (
  option: TValue extends Array<infer U> ? U : NonNullable<TValue>,
) => string

export interface SelectProps<TValue extends SelectValue> extends
  TestId,
  InteractableElement,
  FormElement,
  PopperPropsWithArrowHiddenByDefault,
  CustomizableElement<'select'> {
  /**
   * Controls the visibility of the dropdown.
   * When set to `true`, the dropdown remains hidden.
   * @default false
   */
  isDropdownHidden?: boolean
  /**
   * Whether the select input should display a loading state.
   * This is useful when data is being fetched asynchronously.
   * @default false
   */
  isLoading?: boolean
  /**
   * Determines whether the search term is controlled externally.
   * If `true`, the search term will only be updated when explicitly controlled via props.
   * If `false`, the search term is managed internally.
   * @default false
   */
  isSearchTermControlled?: boolean
  /**
   * Whether to clear the search term when an item is selected.
   * @default false
   */
  clearSearchTermOnSelect?: boolean
  /**
   * A function that determines how selected options are displayed in the input field.
   * It receives the selected option as an argument and should return a string representation.
   */
  displayFn: SelectDisplayFn<TValue>
  /**
   * Configuration for filtering the select options.
   * If `null`, filtering is disabled.
   * @default null;
   */
  filter?: {
    /**
     * Enables or disables filtering of the options.
     */
    isEnabled: boolean
    /**
     * Determines whether the filtering input is displayed inline within the dropdown.
     */
    isInline?: boolean
    /**
     * A custom filtering function that determines whether an option should be shown
     * based on the search term.
     * If not provided, a default filtering function is used.
     */
    fn?: SelectFilterFn<TValue>
  } | null
  /**
   * Icon displayed on the left side of the input field.
   * If `null`, no icon is displayed.
   * @default null
   */
  iconLeft?: Icon | null
  /**
   * Icon displayed on the right side of the input field.
   * @default 'chevronSelectorVertical'
   */
  iconRight?: Icon | null
  /**
   * Placeholder text for the select input when no value is selected.
   * @default null
   */
  placeholder?: string | null
  /**
   * Determines whether the dropdown should remain open when the selected value changes.
   * - If `true`, the dropdown remains open after selecting an option.
   * - If `false`, the dropdown closes when an option is selected.
   * - If `null`, defaults to `true` if the select allows multiple selections, otherwise `false`.
   * @default null
   */
  remainOpenOnSelect?: boolean | null
  /**
   * Placeholder text for the search input.
   * @default null
   */
  searchInputPlaceholder?: string | null
  /**
   * Defines the visual style of the select component.
   */
  variant?: GetComponentProp<'select', 'variant'> | null
  /**
   * Configuration for enabling a virtualized list when displaying large sets of options.
   * @default null
   */
  virtualList?: {
    /**
     * Whether virtualization is enabled for the list of options.
     * This is useful for optimizing performance when dealing with a large number of items.
     */
    isEnabled: boolean
    /**
     * The items to display in the virtualized list.
     */
    items: AcceptableValue[]
    /**
     * The fixed height (in pixels) of each option in the virtualized list.
     * Defaults to `39`
     */
    optionHeight?: number
  } | null
}

export interface SelectItemProps extends TestId {
  /**
   * Whether the option is disabled. If `true`, the option cannot be selected.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The value of the option
   */
  value: AcceptableValue
}
