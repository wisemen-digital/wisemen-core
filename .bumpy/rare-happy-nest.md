---
"@wisemen/vue-core-filters": major
---

- **Breaking: all filter value types now include an operator.** Every filter's value in `useFilters().values` is now a typed `{ operator, value }` object — consumers must update their read/write access accordingly:
  - Multi-select / multi-autocomplete: `TValue[]` → `MultiSelectFilterValue<TValue>` (`{ operator: MultiSelectFilterOperator, values: TValue[] }`)
  - Number: `number | null` → `NumberFilterValue` (`{ operator: NumberFilterOperator, value: number | null }`)
  - Date: `PlainDate | null` → `DateFilterValue` (`{ operator: DateFilterOperator, value: PlainDate | null }`)
  - Date range: `PlainDateRange` → `DateRangeFilterValue` (`{ operator: DateRangeFilterOperator, value: PlainDateRange }`)
  - Boolean: unchanged (`boolean | null`)
- **`disableOperators`** — new property on all filter types. When `true`, the operator dropdown is hidden from the active badge.
- **Boolean filter** — new `trueOperatorLabel` and `falseOperatorLabel` properties to override the default "is" / "is not" text in the badge and dropdown.
