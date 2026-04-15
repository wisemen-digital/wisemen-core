# @wisemen/vue-core-format

## 0.0.1

### Patch Changes

- Initial release of the `@wisemen/vue-core-format` package — a collection of locale-aware formatting utilities and Vue composables for common data types.

  **Composables:**
  - `useDataFormatConfig` — configure global formatting options such as locale
  - `useNumberFormat` — locale-aware number formatting: `format`, `toPercent`, `toCompact`, `toFileSize`, `toRange`
  - `useStringFormat` — locale-aware string formatting: `toList`

  **Utils:**
  - `EmailFormatUtil` — mask email addresses
  - `IbanFormatUtil` — mask IBAN numbers
  - `PersonNameFormatUtil` — compose full names and initials from a `PersonName`
  - `PhoneFormatUtil` — mask phone numbers
  - `StringFormatUtil` — general-purpose string helpers: `format`, `normalizeWhitespace`, `toPrettyUrl`, `toSentenceCase`, `toSlug`, `toTitleCase`, `truncate`, `truncateMiddle`
