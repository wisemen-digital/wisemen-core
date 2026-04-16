# @wisemen/vue-core-format

## 0.0.2

### Patch Changes

- [#853](https://github.com/wisemen-digital/wisemen-core/pull/853) [`457406d`](https://github.com/wisemen-digital/wisemen-core/commit/457406d2f81641dd366bc0b3307d66e89413c043) Thanks [@Robbe95](https://github.com/Robbe95)! - Fixed peer dependency of vue

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
