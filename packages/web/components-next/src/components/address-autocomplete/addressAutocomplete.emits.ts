export interface AddressAutocompleteEmits {
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'error', error: unknown): void
}
