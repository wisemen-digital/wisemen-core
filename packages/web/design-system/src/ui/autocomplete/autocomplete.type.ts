export type AutocompleteValue = number | string | Record<string, any> | null

export interface AutocompleteOptionItem<TValue> {
  type: 'option'
  value: TValue
}

export interface AutocompleteSeparatorItem {
  type: 'separator'
}

export type AutocompleteItem<TValue extends AutocompleteValue> =
  | AutocompleteOptionItem<TValue>
  | AutocompleteSeparatorItem

export function createAutocompleteOptions<TValue extends NonNullable<AutocompleteValue>>(
  options: TValue[],
): AutocompleteItem<TValue>[] {
  return options.map((option) => ({
    type: 'option',
    value: option,
  }))
}
