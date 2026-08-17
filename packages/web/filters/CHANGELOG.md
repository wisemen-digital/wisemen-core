# @wisemen/vue-core-filters








## 10.1.0
<sub>2026-08-13</sub>

- [#1584](https://github.com/wisemen-digital/wisemen-core/pull/1584)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)!
  Add an opt-in `persistInUrl` option to `useFilters`, so filter values can be synced to a URL query string and survive a page refresh or a shared link.

  ```typescript
  useFilters({
    actionGroup: { /* ... */ },
    filters: [ /* ... */ ],
    persistInUrl: true, // or a custom query key, e.g. 'contact-filters'
  })
  ```

  Disabled by default — existing `useFilters` calls are unaffected.
- [#1586](https://github.com/wisemen-digital/wisemen-core/pull/1586)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)!
  Enable fixed weeks on the date picker in `FiltersDialogDateFilter` so the calendar always renders 6 rows, preventing layout shift when navigating between months.

## 10.0.3
<sub>2026-08-05</sub>

- [#1546](https://github.com/wisemen-digital/wisemen-core/pull/1546)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Bumped linter dependencies + adapter rules to usecases of company

## 10.0.2
<sub>2026-07-23</sub>

- [#1478](https://github.com/wisemen-digital/wisemen-core/pull/1478)  *(patch)* Thanks [@NickBanken](https://github.com/NickBanken)! - Increase the FiltersDialogDateRangeFilter width to avoid it being squashed

## 10.0.1
<sub>2026-07-08</sub>

- [#1349](https://github.com/wisemen-digital/wisemen-core/pull/1349)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Normalize all boolean prop names to `is*` / `has*` prefix convention
  Old prop names are still supported but marked as `@deprecated` — they will be removed in a future major release. Update your usage when convenient; no immediate migration required.
  ### `show*` → `has*`
  | Component | Old prop (deprecated) | New prop |
  |---|---|---|
  | `Dialog` | `showCloseButton` | `hasCloseButton` |
  | `DialogFooter` | `showSeparator` | `hasSeparator` |
  | `DialogHeader` | `showSeparator` | `hasSeparator` |
  | `DashboardPageDetailPaneFooter` | `showSeparator` | `hasSeparator` |
  | `DashboardPageDetailPaneHeader` | `showSeparator` | `hasSeparator` |
  | `DateRangePicker` | `showPresets` | `hasPresets` |
  | `NumberField` | `showControls` | `hasControls` |
  ### `hide*` → `is*Hidden`
  | Component | Old prop (deprecated) | New prop |
  |---|---|---|
  | `DialogHeader` | `hideDescription` | `isDescriptionHidden` |
  ### `disable*` / `prevent*` → `is*Disabled`
  | Component | Old prop (deprecated) | New prop |
  |---|---|---|
  | `ContextMenu` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
  | `DropdownMenu` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
  | `DropdownMenu` | `fixedContentPosition` | `isContentPositionFixed` |
  | `Popover` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
  | `Popover` | `disableSideFlip` | `isSideFlipDisabled` |
  | `Text` | `disableTooltip` | `isTooltipDisabled` |
  | `Tooltip` / `ActionTooltip` | `disableCloseOnTriggerClick` | `isCloseOnTriggerClickDisabled` |
  | `Tooltip` | `disableHoverableContent` | `isHoverableContentDisabled` |
  | `DialogFooterButton` | `disableAutoFocus` | `isAutoFocusDisabled` |
  | `Table` | `disableColumnResize` | `isColumnResizeDisabled` |
  | `TableScrollContainer` | `disableScroll` | `isScrollDisabled` |
  | `FormSubmitButton` | `disableKeyboardShortcut` | `isKeyboardShortcutDisabled` |
  | `Dialog` | `preventClickOutside` | `isClickOutsideDisabled` |
  | `Dialog` | `preventEsc` | `isEscDisabled` |
  ### Other verb/noun patterns → `is*` / `has*`
  | Component | Old prop (deprecated) | New prop |
  |---|---|---|
  | `SkeletonItem` | `animate` | `isAnimated` |
  | `DatePicker` | `fixedWeeks` | `hasFixedWeeks` |
  | `FieldWrapper` | `wrap` | `isWrapped` |
  | `TimeField` | `stepSnapping` | `hasStepSnapping` |
  | `KeyboardShortcut` / `KeyboardShortcutKey` | `enableKeyHoldVisualization` | `isKeyHoldVisualizationEnabled` |
  | `Select` | `keepDropdownOpenOnSelect` | `isDropdownKeptOpenOnSelect` |
  | `ActionContextMenu` / `ActionDropdownMenu` / `ActionTrigger` | `currentContextOnly` | `isCurrentContextOnly` |
  | `ContextMenu` / `DropdownMenu` / `Popover` | `prioritizePosition` | `isPrioritizedPosition` |
  ### `no*` → inverted `is*`
  | Component | Old prop (deprecated) | New prop | Note |
  |---|---|---|---|
  | `BadgeGroup` | `noWrap` | `isWrapped` | **Logic inverted** — `:no-wrap="true"` becomes `:is-wrapped="false"`. The new prop defaults to `true`. |
  ### Type field renames
  | Type | Old field (deprecated) | New field |
  |---|---|---|
  | `Toast` | `dismissible` | `isDismissible` |
  | `TableColumn` | `centerHeaderContent` | `isCenteredHeaderContent` |
  | `TableGroupedData` / `TableSubGroupedData` | `defaultOpen` | `isOpenByDefault` |

## 10.0.0
<sub>2026-07-01</sub>

- [#1302](https://github.com/wisemen-digital/wisemen-core/pull/1302)  *(major)* Thanks [@wouterlms](https://github.com/wouterlms)! - - **Breaking: all filter value types now include an operator.** Every filter's value in `useFilters().values` is now a typed `{ operator, value }` object — consumers must update their read/write access accordingly:
    - Multi-select / multi-autocomplete: `TValue[]` → `MultiSelectFilterValue<TValue>` (`{ operator: MultiSelectFilterOperator, values: TValue[] }`)
    - Number: `number | null` → `NumberFilterValue` (`{ operator: NumberFilterOperator, value: number | null }`)
    - Date: `PlainDate | null` → `DateFilterValue` (`{ operator: DateFilterOperator, value: PlainDate | null }`)
    - Date range: `PlainDateRange` → `DateRangeFilterValue` (`{ operator: DateRangeFilterOperator, value: PlainDateRange }`)
    - Boolean: unchanged (`boolean | null`)
  - **`disableOperators`** — new property on all filter types. When `true`, the operator is shown as a static label in the active badge instead of an interactive dropdown.
  - **Boolean filter** — new `trueOperatorLabel` and `falseOperatorLabel` properties to override the default "is" / "is not" text in the badge and dropdown.
- [#1295](https://github.com/wisemen-digital/wisemen-core/pull/1295)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - - Add `DATE` filter type — use `createDateFilter` to let users pick a single `Temporal.PlainDate` via a dialog.
  - Rename `isStatic` to `isPersistent` on all filter types. Persistent filters are always shown in `activeFilters`, cannot be removed by `clearFilter` or `clearAll`, and are sorted before non-persistent filters with a visual separator.
  - Persistent `date` and `date-range` badges now show prev/next navigation arrows and a "Today" action (keyboard shortcuts `←`, `→`, `T`). The navigation step is inferred from the selected range (day / week / month / year / custom).

## 9.0.2
<sub>2026-06-30</sub>

- [#1321](https://github.com/wisemen-digital/wisemen-core/pull/1321)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump dependencies to resolve vulnerabilities

## 9.0.1
<sub>2026-06-12</sub>

- [#1251](https://github.com/wisemen-digital/wisemen-core/pull/1251)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Unsaved view state is now persisted in the URL (`?view-state`). Refreshing the page or navigating away and back restores any unsaved adapter changes (filters, search, columns, etc.). State is cleared automatically when switching views, saving, or deleting.
  Added a "Discard changes" action that resets all adapter state back to the last saved view. Only visible when the view is dirty.
- [#1252](https://github.com/wisemen-digital/wisemen-core/pull/1252)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add `locale-default` to `HourCycle`
- [#1255](https://github.com/wisemen-digital/wisemen-core/pull/1255)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Change `HourCyclePreference` type to `locale-default` instead of `device-default`

## 9.0.0

### Patch Changes

- Updated dependencies [[`ae96fe9`](https://github.com/wisemen-digital/wisemen-core/commit/ae96fe9ec5eaba283350c2f8132f829bfbec4376), [`ec50aa1`](https://github.com/wisemen-digital/wisemen-core/commit/ec50aa10eb51e14175c1991dd4e42c390bfeb796), [`9bf1d69`](https://github.com/wisemen-digital/wisemen-core/commit/9bf1d692a061cb3f0b4d58dc922f9b0c548b73af)]:
  - @wisemen/vue-core-design-system@1.3.0

## 8.0.0

### Patch Changes

- Updated dependencies [[`6d58de4`](https://github.com/wisemen-digital/wisemen-core/commit/6d58de466d7b06d530f539702392a5f5501368da)]:
  - @wisemen/vue-core-design-system@1.2.0

## 7.0.0

### Patch Changes

- Updated dependencies [[`fa82fbe`](https://github.com/wisemen-digital/wisemen-core/commit/fa82fbeae7699c8df2967a43ca0fc4208c47d7e7), [`84567be`](https://github.com/wisemen-digital/wisemen-core/commit/84567bec40a3a26f13c115bd299d4cd446e60b7b), [`47adf52`](https://github.com/wisemen-digital/wisemen-core/commit/47adf52605ffecd47de6536393f54629578c2a6d), [`a4749c7`](https://github.com/wisemen-digital/wisemen-core/commit/a4749c74ceb8606abbe83dd5de5bbf0f1c35f225), [`e2cd65d`](https://github.com/wisemen-digital/wisemen-core/commit/e2cd65d16b03718c86eb06b0139ca9c93555ea56), [`f0176d2`](https://github.com/wisemen-digital/wisemen-core/commit/f0176d287a3912fc97478cd305e3e71b13224cfd), [`5b5137d`](https://github.com/wisemen-digital/wisemen-core/commit/5b5137d5cd817e4f8426dcc9d1257bcec3582351)]:
  - @wisemen/vue-core-design-system@1.1.0

## 6.0.0

### Patch Changes

- Updated dependencies [[`ba325a4`](https://github.com/wisemen-digital/wisemen-core/commit/ba325a4063568821437efe5aa4c8ce279666f8af), [`e45daad`](https://github.com/wisemen-digital/wisemen-core/commit/e45daadb624766f5c0f0bae4a9687e12b3ef45c9), [`b1868dd`](https://github.com/wisemen-digital/wisemen-core/commit/b1868dd96b8200b4fe4ce73ed4acb49c63de9f2f), [`2650566`](https://github.com/wisemen-digital/wisemen-core/commit/26505661db96e1a29490ecf685a1e7dc7595b47e), [`31c3a85`](https://github.com/wisemen-digital/wisemen-core/commit/31c3a85b10f0092550af2adeafc6db20436a1305), [`9137e1d`](https://github.com/wisemen-digital/wisemen-core/commit/9137e1d8afdb91b6fe9fe289f11d977c6ddff8c7)]:
  - @wisemen/vue-core-design-system@1.0.0
  - @wisemen/vue-core-dates@1.0.0

## 5.0.0

### Patch Changes

- Updated dependencies [[`c6a5357`](https://github.com/wisemen-digital/wisemen-core/commit/c6a5357393ef6d0e9ac5c9192aca60a3a9fe167b)]:
  - @wisemen/vue-core-design-system@0.17.0

## 4.0.0

### Patch Changes

- Updated dependencies [[`7e45f00`](https://github.com/wisemen-digital/wisemen-core/commit/7e45f006ede671d496cc7e5c2ac48a2528b3ff1c), [`78f75cb`](https://github.com/wisemen-digital/wisemen-core/commit/78f75cbfb2ac8ee01d55c6a0a109addf9e6c81f5), [`3f22d6a`](https://github.com/wisemen-digital/wisemen-core/commit/3f22d6a0f47b98b2b695a2173c1e592be8378910)]:
  - @wisemen/vue-core-design-system@0.16.0

## 3.0.0

### Patch Changes

- Updated dependencies [[`ff0a5ce`](https://github.com/wisemen-digital/wisemen-core/commit/ff0a5cea92fac51c4b6686935770be020e6c4377)]:
  - @wisemen/vue-core-design-system@0.15.0

## 2.0.0

### Patch Changes

- Updated dependencies [[`673f352`](https://github.com/wisemen-digital/wisemen-core/commit/673f352d20d563c3e9f4751f08f97ca4d8765e0f), [`2654ffc`](https://github.com/wisemen-digital/wisemen-core/commit/2654ffc638375858b8e7023f4ce0062123131299), [`38dbe43`](https://github.com/wisemen-digital/wisemen-core/commit/38dbe43b30125dcea8c716aa1019f81461356292), [`ea37a96`](https://github.com/wisemen-digital/wisemen-core/commit/ea37a96a4c1a475a863bf39bdb9a598f3b390957), [`59f590a`](https://github.com/wisemen-digital/wisemen-core/commit/59f590af0cb9078794aed963b63da95e07367120)]:
  - @wisemen/vue-core-design-system@0.14.0
  - @wisemen/vue-core-actions@0.1.2
  - @wisemen/vue-core-utils@0.1.0

## 1.0.0

### Patch Changes

- Updated dependencies [[`ea220f5`](https://github.com/wisemen-digital/wisemen-core/commit/ea220f55b92394093a8768ddb9fa5c5475145ff2), [`1e47245`](https://github.com/wisemen-digital/wisemen-core/commit/1e47245cfb6c4361fc9eae658707131a59cee2c4), [`2963267`](https://github.com/wisemen-digital/wisemen-core/commit/2963267c08e4c4752664ec39f9f0dfb8f1e84e35), [`62a0298`](https://github.com/wisemen-digital/wisemen-core/commit/62a029887da5b4609506729c25baba1ea375820f)]:
  - @wisemen/vue-core-design-system@0.13.0
