export interface PreferencesDropdownMenuOption<TValue> {
  description?: string | null
  hint?: string | null
  label: string
  value: TValue
}
