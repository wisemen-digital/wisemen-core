# Changelog









## 1.0.3
<sub>2026-08-04</sub>

- [#1404](https://github.com/wisemen-digital/wisemen-core/pull/1404)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Improve scoring algorithm

## 1.0.2
<sub>2026-08-03</sub>

- [#1531](https://github.com/wisemen-digital/wisemen-core/pull/1531)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Make select and autocomplete popovers responsive on mobile. The popover will become a bottom drawer with the options

## 1.0.1
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

## 1.0.0
<sub>2026-07-01</sub>

- *(major)* Updated dependency `@wisemen/vue-core-filters` v10.0.0

## 0.3.2
<sub>2026-06-30</sub>

- [#1321](https://github.com/wisemen-digital/wisemen-core/pull/1321)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump dependencies to resolve vulnerabilities

## 0.3.1
<sub>2026-06-30</sub>

- [#1260](https://github.com/wisemen-digital/wisemen-core/pull/1260)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Fixed peer dependency versioning

## 0.3.0
<sub>2026-06-12</sub>

- [#1259](https://github.com/wisemen-digital/wisemen-core/pull/1259)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add `createCustomViewSortStateAdapter`

## 0.2.0
<sub>2026-06-12</sub>

- [#1251](https://github.com/wisemen-digital/wisemen-core/pull/1251)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Unsaved view state is now persisted in the URL (`?view-state`). Refreshing the page or navigating away and back restores any unsaved adapter changes (filters, search, columns, etc.). State is cleared automatically when switching views, saving, or deleting.
  Added a "Discard changes" action that resets all adapter state back to the last saved view. Only visible when the view is dirty.

## 0.1.0
<sub>2026-06-08</sub>

- [#1229](https://github.com/wisemen-digital/wisemen-core/pull/1229)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Initial release of the @wisemen/vue-core-custom-views package — provides a complete custom views management system with adapters for state (filters, search, table columns) and storage (localStorage), color/icon pickers, and CRUD dialogs for named views
