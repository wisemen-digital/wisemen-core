export type SelectValue = number | string | Record<string, any> | null

export interface SelectOptionItem<SelectValue> {
  type: 'option'
  value: SelectValue
}
export interface SelectSeparatorItem {
  type: 'separator'
}

export type SelectItem<TValue extends SelectValue> = SelectOptionItem<TValue> | SelectSeparatorItem

export function createSelectOptions<TValue extends NonNullable<SelectValue>>(
  options: TValue[],
): SelectItem<TValue>[] {
  return options.map((option) => ({
    type: 'option',
    value: option,
  }))
}
