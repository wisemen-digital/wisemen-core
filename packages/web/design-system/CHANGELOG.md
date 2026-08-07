# Changelog


































## 1.20.2
<sub>2026-08-07</sub>

- [#1559](https://github.com/wisemen-digital/wisemen-core/pull/1559)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed Dialog closing at the same time as a nested open Popover/Autocomplete on outside click, which caused a visible position jump when the popover was near a viewport edge.

## 1.20.1
<sub>2026-08-06</sub>

- [#1556](https://github.com/wisemen-digital/wisemen-core/pull/1556)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed NumberField not parsing unit, percent, or currency formatted values, causing edits to revert on blur.

## 1.20.0
<sub>2026-08-05</sub>

- [#1547](https://github.com/wisemen-digital/wisemen-core/pull/1547)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - `DetailListGroupItem` now supports a `horizontalValueAlignment` prop (`start` | `end`) to align the value to the end of the row when laid out horizontally
- [#1546](https://github.com/wisemen-digital/wisemen-core/pull/1546)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Bumped linter dependencies + adapter rules to usecases of company
- [#1549](https://github.com/wisemen-digital/wisemen-core/pull/1549)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fixed `Badge` separator spacing to scale with size instead of always using a fixed margin

## 1.19.1
<sub>2026-08-04</sub>

- [#1404](https://github.com/wisemen-digital/wisemen-core/pull/1404)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Improve scoring algorithm
- [#1527](https://github.com/wisemen-digital/wisemen-core/pull/1527)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Breadcrumbs and global search are not hidden in the top bar for a improved mobile experience

## 1.19.0
<sub>2026-08-03</sub>

- [#1531](https://github.com/wisemen-digital/wisemen-core/pull/1531)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Make select and autocomplete popovers responsive on mobile. The popover will become a bottom drawer with the options

## 1.18.1
<sub>2026-07-31</sub>

- [#1534](https://github.com/wisemen-digital/wisemen-core/pull/1534)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed the date picker and date range picker opening on a fully-disabled month when today's date (or the current value) falls before minDate or after maxDate; the calendar now opens clamped to the nearest selectable date.

## 1.18.0
<sub>2026-07-31</sub>

- [#1496](https://github.com/wisemen-digital/wisemen-core/pull/1496)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Added a `config` prop to `TabsItem`/`TabsRouterLinkItem` for left content and a right-side indicator (count badge or dot, e.g. to flag a tab with a form error), matching `MenuItemConfig`'s API shape. The existing `icon`/`count` props are deprecated but still work.
- [#1497](https://github.com/wisemen-digital/wisemen-core/pull/1497)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed the detail pane's bordered variants clipping the sticky header and footer backgrounds to square corners instead of the pane's rounded border.
- [#1498](https://github.com/wisemen-digital/wisemen-core/pull/1498)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed the date picker calendar opening on the current month instead of the month of the bound value.
- [#1499](https://github.com/wisemen-digital/wisemen-core/pull/1499)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed the Switch component shrinking when placed in a flex container with limited space.

## 1.17.0
<sub>2026-07-27</sub>

- [#1494](https://github.com/wisemen-digital/wisemen-core/pull/1494)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Added badge/count and status dot support to main sidebar navigation sub-items.

## 1.16.0
<sub>2026-07-17</sub>

- [#1458](https://github.com/wisemen-digital/wisemen-core/pull/1458)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Added Badge left config, isDisabled and iconColor props, a neutral color, and deprecated the outline variant and the icon/dot/avatar props.
- [#1460](https://github.com/wisemen-digital/wisemen-core/pull/1460)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Added a 'Tomorrow' preset to the date range field.
- [#1459](https://github.com/wisemen-digital/wisemen-core/pull/1459)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed NumberField incorrectly parsing values like "0,11111" as thousands instead of decimals.
- [#1460](https://github.com/wisemen-digital/wisemen-core/pull/1460)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed the dialog close button and header/footer separators never rendering due to a broken deprecated-prop fallback.
- [#1464](https://github.com/wisemen-digital/wisemen-core/pull/1464)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fixed branded MainLayout showing no background in dark mode.

## 1.15.1
<sub>2026-07-17</sub>

- [#1457](https://github.com/wisemen-digital/wisemen-core/pull/1457)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix isCurrentContextOnly and currentContextOnly props both being required

## 1.15.0
<sub>2026-07-16</sub>

- [#1455](https://github.com/wisemen-digital/wisemen-core/pull/1455)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add a onRowClick prop to the table component. to make rows have a click handler
- [#1439](https://github.com/wisemen-digital/wisemen-core/pull/1439)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Made today's date bold in the date picker and date range picker calendar grids, so it stays visually distinguishable from custom day dots.
- [#1444](https://github.com/wisemen-digital/wisemen-core/pull/1444)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Make sure the data in the table fetches the next page when the table is bigger then the content
- [#1452](https://github.com/wisemen-digital/wisemen-core/pull/1452)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add a shrink-0 to the primitive children of the badge truncate component

## 1.14.2
<sub>2026-07-15</sub>

- [#1448](https://github.com/wisemen-digital/wisemen-core/pull/1448)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Made FormFieldGroup stretch its columns to fill the available width instead of leaving them at their content size.
- [#1448](https://github.com/wisemen-digital/wisemen-core/pull/1448)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Handle the system apearance correctly in the branded sidebar
- [#1448](https://github.com/wisemen-digital/wisemen-core/pull/1448)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add dark mode variables to branded css class and only check via css

## 1.14.1
<sub>2026-07-14</sub>

- [#1431](https://github.com/wisemen-digital/wisemen-core/pull/1431)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Hide the overlfow-x in the main sidebar
- [#1431](https://github.com/wisemen-digital/wisemen-core/pull/1431)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Invert check for missing type in `mainSidebarNavigationLink`

## 1.14.0
<sub>2026-07-14</sub>

- [#1418](https://github.com/wisemen-digital/wisemen-core/pull/1418)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - UIDropdownMenu, UIContextMenu: Content can now grow past its min-width to fit larger items. While open,
  it remembers the widest size it has rendered at so it never shrinks back
  down and shifts the layout; this resets each time the menu is reopened. This requires `is-adaptive-content-width: true`
- [#1409](https://github.com/wisemen-digital/wisemen-core/pull/1409)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fix `FormDialog` and `DialogChin` issues:
  - Pressing Esc on a dirty `FormDialog` now shows the unsaved-changes confirmation chin instead of discarding changes immediately; pressing Esc again closes the dialog and discards the changes
  - Fixed a height jump/chop in the dialog chin's open animation, most noticeable when it opened at the same time as a form field's error message
  - Closing a `FormDialog` with unsaved changes no longer marks every form field as touched, so validation errors no longer appear on fields the user never interacted with
- [#1413](https://github.com/wisemen-digital/wisemen-core/pull/1413)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Remove unsude component from sidebar
- [#1419](https://github.com/wisemen-digital/wisemen-core/pull/1419)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix dropdown/context menus not keeping an item highlighted while navigating via keyboard. Items loaded in asynchronously, or a list filtered down to zero results and then cleared, could end up with nothing highlighted. The first item is now kept highlighted for as long as the menu stays open and the user is driving it via keyboard, including once a search/filter kicks in on a menu that was opened with the mouse.

## 1.13.0
<sub>2026-07-08</sub>

- [#1383](https://github.com/wisemen-digital/wisemen-core/pull/1383)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - feat(select,autocomplete): add `isTriggerHidden` prop to hide the chevron trigger icon. Defaults to `true` for `Autocomplete`.
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
- [#1349](https://github.com/wisemen-digital/wisemen-core/pull/1349)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Normalize additional boolean prop names to `is*`/`has*` convention, filling gaps missed by the initial normalization pass.
  Old prop names are still supported but marked as `@deprecated` — they will be removed in a future major release.
  | Component | Old prop (deprecated) | New prop |
  |---|---|---|
  | `TextField` / `TextareaField` / `NumberField` / `Select` / `Autocomplete` / `TagsField` / `DateField` / `TimeField` / `DateRangeField` / `PhoneNumberField` / `FormFileUpload` / `Checkbox` / `Switch` / `RadioGroup` (via shared `InputWrapper` type) | `hideErrorMessage` | `isErrorMessageHidden` |
  | `MainSidebarNavigationSubItem` | `noIndent` | `isIndented` (inverted, defaults to `true`) |
  | `FormDialog` / `Form` | `promptOnUnsavedChanges` | `isUnsavedChangesPromptEnabled` |
  | `FormDialog` | `renderOwnFormComponent` | `hasOwnFormComponent` |
  | `TagsField` | `addOnBlur` | `isAddedOnBlur` |
  | `TagsField` | `addOnPaste` | `isAddedOnPaste` |
  | `TagsField` | `addOnTab` | `isAddedOnTab` |
  | `TagsField` | `allowDuplicate` | `isDuplicateAllowed` |

## 1.12.0
<sub>2026-07-08</sub>

- [#1340](https://github.com/wisemen-digital/wisemen-core/pull/1340)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add `variant="branded"` prop to `UIMainLayout` — applies a deep brand gradient to the sidebar and topbar while leaving the main content area unaffected. Introduces a new `.branded` CSS theme class in `@wisemen/vue-core-tailwind-config` that maps all semantic color tokens to brand-scale values.
- [#1348](https://github.com/wisemen-digital/wisemen-core/pull/1348)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add an optional tooltip description for the table header
- [#1313](https://github.com/wisemen-digital/wisemen-core/pull/1313)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - `DashboardSidebarNavLink` is now the union of two explicit shapes, both exported from `@wisemen/vue-core-design-system`:
  - **`SidebarNavLinkItem`** — a link that navigates directly to a route. Requires `to`, has no `subItems`.
  - **`SidebarNavSubItemsItem`** — a link that expands into sub-items. Requires `subItems`, has no `to`.
  Each shape also accepts an optional `type` discriminator (`'link'` or `'sub-items'`) for clearer intent and stricter narrowing, but it is not required — existing nav link objects keep working as-is:
  ```ts
  const links: DashboardSidebarNavLink[] = [
    { type: 'link', label: 'Dashboard', icon: DashboardIcon, to: { path: '/' } },
    { type: 'sub-items', label: 'Reports', icon: ReportsIcon, subItems: [...] },
  ]
  ```
- [#1378](https://github.com/wisemen-digital/wisemen-core/pull/1378)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add a `getDayConfig` prop to `DateField`, `DateRangeField`, `DatePicker`, and `DateRangePicker` to mark specific calendar days with a colored dot (e.g. birthdays or holidays)
- [#1345](https://github.com/wisemen-digital/wisemen-core/pull/1345)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Remove shadow from the text area field
- [#1346](https://github.com/wisemen-digital/wisemen-core/pull/1346)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - The vertical spacing between the title and the description of the dialog header will be 'xxs' instead of 'md'
- [#1352](https://github.com/wisemen-digital/wisemen-core/pull/1352)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Make the chevron in the select fully clickable
- [#1370](https://github.com/wisemen-digital/wisemen-core/pull/1370)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Change copy of unsaved changes dialog chin

## 1.11.1
<sub>2026-07-06</sub>

- [#1371](https://github.com/wisemen-digital/wisemen-core/pull/1371)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add an optional `getItemKey` prop to `UIAutocomplete` and `UISelect` for supplying a stable, unique key per item (defaults to `JSON.stringify(value)` when not provided).
  Also fixes `UISelect`: dropdown items were previously keyed with a random string regenerated on every render, so Vue tore down and recreated every option on any items/search/selection change instead of patching them. Item identity (for selected/non-selected matching) is now derived consistently from the same key.

## 1.11.0
<sub>2026-07-03</sub>

- [#1351](https://github.com/wisemen-digital/wisemen-core/pull/1351)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add "Discard changes" and "Keep editing" action buttons to the default unsaved-changes chin in `UIFormDialog`

## 1.10.1
<sub>2026-07-02</sub>

- [#1347](https://github.com/wisemen-digital/wisemen-core/pull/1347)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Return early if document is not defined in reduced motion composable to support ssr / ssg

## 1.10.0
<sub>2026-07-01</sub>

- [#1194](https://github.com/wisemen-digital/wisemen-core/pull/1194)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Table: add `is-selectable` prop to select one, more or all rows
- [#1181](https://github.com/wisemen-digital/wisemen-core/pull/1181)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix Button and IconButton styling inconsistencies
- [#1339](https://github.com/wisemen-digital/wisemen-core/pull/1339)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Align tooltip border radius with other radii
- [#1341](https://github.com/wisemen-digital/wisemen-core/pull/1341)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix min and max table column width

## 1.9.1
<sub>2026-06-30</sub>

- [#1321](https://github.com/wisemen-digital/wisemen-core/pull/1321)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump dependencies to resolve vulnerabilities

## 1.9.0
<sub>2026-06-30</sub>

- [#1324](https://github.com/wisemen-digital/wisemen-core/pull/1324)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - DropdownMenu: add `fixedContentPosition` prop
- [#1329](https://github.com/wisemen-digital/wisemen-core/pull/1329)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add exports for chin types

## 1.8.0
<sub>2026-06-30</sub>

- [#1249](https://github.com/wisemen-digital/wisemen-core/pull/1249)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add a built in unsaved changes pop-up in the form dialogs using the dialog chin
- [#1260](https://github.com/wisemen-digital/wisemen-core/pull/1260)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Added libphonenumber-js max + bumped the dependency
- [#1311](https://github.com/wisemen-digital/wisemen-core/pull/1311)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add horizontal scroll to tabs when overflowing
- [#1327](https://github.com/wisemen-digital/wisemen-core/pull/1327)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add export for the `useDialogChin`

## 1.7.1
<sub>2026-06-25</sub>

- [#1309](https://github.com/wisemen-digital/wisemen-core/pull/1309)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Badge: improve gray outline and translucent styling

## 1.7.0
<sub>2026-06-23</sub>

- [#1245](https://github.com/wisemen-digital/wisemen-core/pull/1245)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add sticky header, footer, body and tabs components for `DashboardPageDetailPane`
  New components:
  - `UIDashboardPageDetailPaneHeader` — sticky header built on `UIBaseHeader`, separator fades when scrolled to top, auto-hides separator when tabs are present
  - `UIDashboardPageDetailPaneFooter` — sticky footer with a default slot, separator fades when scrolled to bottom
  - `UIDashboardPageDetailPaneBody` — scrollable body, connects scroll tracking to header/footer separators
  - `UIDashboardPageDetailPaneTabs` — compound tabs root (`underline` variant, full-width, with padding by default)
  - `UIDashboardPageDetailPaneTabsList` — sticky tabs list bar
  - `UIDashboardPageDetailPaneTabsContent` — scrollable tab content panel, connects scroll tracking per active tab
- [#1303](https://github.com/wisemen-digital/wisemen-core/pull/1303)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix issues where table columns are truncated
- [#1304](https://github.com/wisemen-digital/wisemen-core/pull/1304)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Table: Hide empty state illustration for contained variant
- [#1305](https://github.com/wisemen-digital/wisemen-core/pull/1305)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Table: fix issue where for the contained variant a 1px border would be visual when empty

## 1.6.1
<sub>2026-06-18</sub>

- [#1292](https://github.com/wisemen-digital/wisemen-core/pull/1292)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add export for keyboard shortcut type

## 1.6.0
<sub>2026-06-17</sub>

- [#1146](https://github.com/wisemen-digital/wisemen-core/pull/1146)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add UIFormFileUpload with shared file-reference DTOs and transformers, Storybook coverage, translations, and improved base file-upload adapter/disabled handling.
- [#1146](https://github.com/wisemen-digital/wisemen-core/pull/1146)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add new BaseFileUpload component

## 1.5.1
<sub>2026-06-16</sub>

- [#1267](https://github.com/wisemen-digital/wisemen-core/pull/1267)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Remove enter and exit animation from dropdown menu sub content and context menu sub content
- [#1269](https://github.com/wisemen-digital/wisemen-core/pull/1269)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Remove the broken adaptive overflow behavior from Tabs and RouterLinkTabs, keeping tabs scrollable instead.
- [#1262](https://github.com/wisemen-digital/wisemen-core/pull/1262)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: move @wisemen/ngen to wisemen-core repo

## 1.5.0
<sub>2026-06-12</sub>

- [#1189](https://github.com/wisemen-digital/wisemen-core/pull/1189)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add actions to badges
- [#1258](https://github.com/wisemen-digital/wisemen-core/pull/1258)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add `shift+A` keyboard shortcut to auto-fit table columns
- [#1200](https://github.com/wisemen-digital/wisemen-core/pull/1200)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add slot for UIDashboardCenteredPageContentHeader
- [#1243](https://github.com/wisemen-digital/wisemen-core/pull/1243)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fix editing address in popover
- [#1242](https://github.com/wisemen-digital/wisemen-core/pull/1242)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Fix dark mode issues in DateRangeField, Dialog, and Tabs
- [#1239](https://github.com/wisemen-digital/wisemen-core/pull/1239)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add transparent gray badge variant
- [#1244](https://github.com/wisemen-digital/wisemen-core/pull/1244)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add onBlur and onTab props to TagsField

## 1.4.2
<sub>2026-06-12</sub>

- [#1252](https://github.com/wisemen-digital/wisemen-core/pull/1252)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add `locale-default` to `HourCycle`

## 1.4.1
<sub>2026-06-09</sub>

- [#1237](https://github.com/wisemen-digital/wisemen-core/pull/1237)  *(patch)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - use correct date index to preview selected month

## 1.4.0
<sub>2026-06-08</sub>

- [#1223](https://github.com/wisemen-digital/wisemen-core/pull/1223)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add moss color variant to badge and dot components
- [#1224](https://github.com/wisemen-digital/wisemen-core/pull/1224)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Improve dialog z-index handling (overlay now tracks z-index dynamically), add destructive mode and isDisabled prop to DialogFooterSubmit, fix FormDialog close button prop name, reduce ConfirmDialog size to xxs, and adjust DialogHeader gap
- [#1225](https://github.com/wisemen-digital/wisemen-core/pull/1225)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Track vertical scroll state in table, hide last row border when table is scrollable or contained, debounce column width resize capture to reduce jank
- [#1226](https://github.com/wisemen-digital/wisemen-core/pull/1226)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add v-maska directive support to TextField via the new mask prop, enabling declarative input masking
- [#1228](https://github.com/wisemen-digital/wisemen-core/pull/1228)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add bottom slot to ActionContextMenu and ActionDropdownMenu for custom footer content; add settings and application action groups; fix filter input visibility to use sr-only instead of v-if so keyboard-initiated typing is captured immediately
- [#1227](https://github.com/wisemen-digital/wisemen-core/pull/1227)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix DateField padding style and remove redundant isPickerHidden style variant, fix TimeField padding, use device locale instead of config locale, add isLabelHidden support, and add right slot passthrough
- [#1230](https://github.com/wisemen-digital/wisemen-core/pull/1230)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Fix typo in colors.css (text-teriary-on-brand → text-tertiary-on-brand), raise Toast z-index to 75, fix sidebar account card to use current-context-only, fix dashboard page to use global context, forward isLabelHidden in Select, export scrollable and text-shimmer UI modules, export tv utility, export PreferencesSection, PreferencesDropdownMenu, and PreferencesDropdownMenuOption from preferences
- [#1236](https://github.com/wisemen-digital/wisemen-core/pull/1236)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Change "meta" to "mod" to support shortcuts on windows

## 1.3.2
<sub>2026-06-08</sub>

- [#1196](https://github.com/wisemen-digital/wisemen-core/pull/1196)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Emit `@open` for UIContextMenu and UIActionContextMenu components

## 1.3.1

### Patch Changes

- [#1192](https://github.com/wisemen-digital/wisemen-core/pull/1192) [`aa7ce95`](https://github.com/wisemen-digital/wisemen-core/commit/aa7ce9557073e785894fec3c23493b1445ae3216) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add more spacing to the timeline component md version

## 1.3.0

### Minor Changes

- [#1118](https://github.com/wisemen-digital/wisemen-core/pull/1118) [`ae96fe9`](https://github.com/wisemen-digital/wisemen-core/commit/ae96fe9ec5eaba283350c2f8132f829bfbec4376) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add UITagsField component

- [#1193](https://github.com/wisemen-digital/wisemen-core/pull/1193) [`ec50aa1`](https://github.com/wisemen-digital/wisemen-core/commit/ec50aa10eb51e14175c1991dd4e42c390bfeb796) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - - **router-link**: make button brand variant smaller

  - **detail-pane**: add default min and max width
  - **sidebar**: make tooltip visible in icons-only mode
  - **dashboard-page**: remove unused tabs prop
  - **table**: add error state component
  - **select**: add slot right when no menu item config is passed
  - **select**: adjust margin left for badges in multiselect container
  - **select**: remove separators when search is active

- [#1191](https://github.com/wisemen-digital/wisemen-core/pull/1191) [`9bf1d69`](https://github.com/wisemen-digital/wisemen-core/commit/9bf1d692a061cb3f0b4d58dc922f9b0c548b73af) Thanks [@wouterlms](https://github.com/wouterlms)! - Table: add `sort` prop

## 1.2.0

### Minor Changes

- [#1186](https://github.com/wisemen-digital/wisemen-core/pull/1186) [`6d58de4`](https://github.com/wisemen-digital/wisemen-core/commit/6d58de466d7b06d530f539702392a5f5501368da) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Change dashboard page conent padding to 2xl

## 1.1.1

### Patch Changes

- [#1178](https://github.com/wisemen-digital/wisemen-core/pull/1178) [`220b356`](https://github.com/wisemen-digital/wisemen-core/commit/220b356075a19e45cc1b1d1b2f7a5d90a1ed9df7) Thanks [@wouterlms](https://github.com/wouterlms)! - Table: fix column sizing

- Updated dependencies [[`0d85230`](https://github.com/wisemen-digital/wisemen-core/commit/0d852301fc29efbc672479e7aa80f22266d2bfee)]:
  - @wisemen/vue-core-dates@1.0.1

## 1.1.0

### Minor Changes

- [#1179](https://github.com/wisemen-digital/wisemen-core/pull/1179) [`84567be`](https://github.com/wisemen-digital/wisemen-core/commit/84567bec40a3a26f13c115bd299d4cd446e60b7b) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Add IsOpen and isToggleHidden to the detail pane config

- [#1183](https://github.com/wisemen-digital/wisemen-core/pull/1183) [`e2cd65d`](https://github.com/wisemen-digital/wisemen-core/commit/e2cd65d16b03718c86eb06b0139ca9c93555ea56) Thanks [@wouterlms](https://github.com/wouterlms)! - Add immediate flag to useSearch's updateSearch

- [#1180](https://github.com/wisemen-digital/wisemen-core/pull/1180) [`5b5137d`](https://github.com/wisemen-digital/wisemen-core/commit/5b5137d5cd817e4f8426dcc9d1257bcec3582351) Thanks [@wouterlms](https://github.com/wouterlms)! - Add `setState` to `useTableCustomizeColumns`

### Patch Changes

- [#1176](https://github.com/wisemen-digital/wisemen-core/pull/1176) [`fa82fbe`](https://github.com/wisemen-digital/wisemen-core/commit/fa82fbeae7699c8df2967a43ca0fc4208c47d7e7) Thanks [@wouterlms](https://github.com/wouterlms)! - Export UIInputWrapper

- [#1170](https://github.com/wisemen-digital/wisemen-core/pull/1170) [`47adf52`](https://github.com/wisemen-digital/wisemen-core/commit/47adf52605ffecd47de6536393f54629578c2a6d) Thanks [@wouterlms](https://github.com/wouterlms)! - Move `@wisemen/vue-core-design-system` to peer dependencies

- [#1175](https://github.com/wisemen-digital/wisemen-core/pull/1175) [`a4749c7`](https://github.com/wisemen-digital/wisemen-core/commit/a4749c74ceb8606abbe83dd5de5bbf0f1c35f225) Thanks [@wouterlms](https://github.com/wouterlms)! - Table: fix issue where `get-link` would not work

- [#1175](https://github.com/wisemen-digital/wisemen-core/pull/1175) [`f0176d2`](https://github.com/wisemen-digital/wisemen-core/commit/f0176d287a3912fc97478cd305e3e71b13224cfd) Thanks [@wouterlms](https://github.com/wouterlms)! - Remove `cursor-pointer` from non-link elements

- Updated dependencies [[`cbcc93c`](https://github.com/wisemen-digital/wisemen-core/commit/cbcc93c1735697582e3714cf34330e9a059d2809)]:
  - @wisemen/vue-core-api-utils@2.0.1

## 1.0.0

### Minor Changes

- [#1165](https://github.com/wisemen-digital/wisemen-core/pull/1165) [`b1868dd`](https://github.com/wisemen-digital/wisemen-core/commit/b1868dd96b8200b4fe4ce73ed4acb49c63de9f2f) Thanks [@wouterlms](https://github.com/wouterlms)! - - **Table**: Added `getRowLink` prop to make rows clickable links. When using interactable elements inside a cell

- [#1150](https://github.com/wisemen-digital/wisemen-core/pull/1150) [`2650566`](https://github.com/wisemen-digital/wisemen-core/commit/26505661db96e1a29490ecf685a1e7dc7595b47e) Thanks [@wouterlms](https://github.com/wouterlms)! - Date formatting now uses configContext.dateLocale. The locale is resolved in order: configContext.dateLocale → navigator.language.

### Patch Changes

- [#1164](https://github.com/wisemen-digital/wisemen-core/pull/1164) [`ba325a4`](https://github.com/wisemen-digital/wisemen-core/commit/ba325a4063568821437efe5aa4c8ce279666f8af) Thanks [@wouterlms](https://github.com/wouterlms)! - - **Table**: Fixed `variant` and `disableColumnResize` props not being forwarded correctly

- [#1169](https://github.com/wisemen-digital/wisemen-core/pull/1169) [`e45daad`](https://github.com/wisemen-digital/wisemen-core/commit/e45daadb624766f5c0f0bae4a9687e12b3ef45c9) Thanks [@wouterlms](https://github.com/wouterlms)! - Use correct z-indexes for components with popovers or dialogs

- [#1152](https://github.com/wisemen-digital/wisemen-core/pull/1152) [`31c3a85`](https://github.com/wisemen-digital/wisemen-core/commit/31c3a85b10f0092550af2adeafc6db20436a1305) Thanks [@wouterlms](https://github.com/wouterlms)! - column visibility state now respects the order defined in `initialState`

- Updated dependencies [[`9137e1d`](https://github.com/wisemen-digital/wisemen-core/commit/9137e1d8afdb91b6fe9fe289f11d977c6ddff8c7)]:
  - @wisemen/vue-core-dates@1.0.0

## 0.17.0

### Minor Changes

- [#1140](https://github.com/wisemen-digital/wisemen-core/pull/1140) [`c6a5357`](https://github.com/wisemen-digital/wisemen-core/commit/c6a5357393ef6d0e9ac5c9192aca60a3a9fe167b) Thanks [@wouterlms](https://github.com/wouterlms)! - Export `UIPage` component

## 0.16.0

### Minor Changes

- [#1130](https://github.com/wisemen-digital/wisemen-core/pull/1130) [`3f22d6a`](https://github.com/wisemen-digital/wisemen-core/commit/3f22d6a0f47b98b2b695a2173c1e592be8378910) Thanks [@wouterlms](https://github.com/wouterlms)! - Add table components + useTableCustomizeColumns

### Patch Changes

- [#1133](https://github.com/wisemen-digital/wisemen-core/pull/1133) [`7e45f00`](https://github.com/wisemen-digital/wisemen-core/commit/7e45f006ede671d496cc7e5c2ac48a2528b3ff1c) Thanks [@wouterlms](https://github.com/wouterlms)! - MainLayout: Fixed an issue where the component would overflow

- [#1129](https://github.com/wisemen-digital/wisemen-core/pull/1129) [`78f75cb`](https://github.com/wisemen-digital/wisemen-core/commit/78f75cbfb2ac8ee01d55c6a0a109addf9e6c81f5) Thanks [@wouterlms](https://github.com/wouterlms)! - ConfirmDialog: Fixed an issue where the loading state would not show when confirming

## 0.15.2

### Patch Changes

- [#1125](https://github.com/wisemen-digital/wisemen-core/pull/1125) [`8778c91`](https://github.com/wisemen-digital/wisemen-core/commit/8778c91448c24c0f7f6708751a9440f033b2e812) Thanks [@wouterlms](https://github.com/wouterlms)! - Fix: Elevate overlay z-index to 50 to render above dialogs

## 0.15.1

### Patch Changes

- Updated dependencies [[`0211369`](https://github.com/wisemen-digital/wisemen-core/commit/021136927912bb49db2e16b868845fd3a218102d)]:
  - @wisemen/vue-core-api-utils@2.0.0

## 0.15.0

Initial release
