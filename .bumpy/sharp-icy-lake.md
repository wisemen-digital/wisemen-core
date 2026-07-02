---
"@wisemen/vue-core-custom-views": major
"@wisemen/vue-core-design-system": major
"@wisemen/vue-core-filters": major
---

Normalize all boolean prop names to `is*` / `has*` prefix convention

All packages that consume `@wisemen/vue-core-design-system` components will need to update prop bindings according to the tables below.

## Breaking changes

### `show*` → `has*`

| Component | Old prop | New prop |
|---|---|---|
| `Dialog` | `showCloseButton` | `hasCloseButton` |
| `DialogFooter` | `showSeparator` | `hasSeparator` |
| `DialogHeader` | `showSeparator` | `hasSeparator` |
| `DashboardPageDetailPaneFooter` | `showSeparator` | `hasSeparator` |
| `DashboardPageDetailPaneHeader` | `showSeparator` | `hasSeparator` |
| `DateRangePicker` | `showPresets` | `hasPresets` |
| `NumberField` | `showControls` | `hasControls` |

### `hide*` → `is*Hidden`

| Component | Old prop | New prop |
|---|---|---|
| `DialogHeader` | `hideDescription` | `isDescriptionHidden` |

### `disable*` / `prevent*` → `is*Disabled`

| Component | Old prop | New prop |
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

| Component | Old prop | New prop |
|---|---|---|
| `SkeletonItem` | `animate` | `isAnimated` |
| `DatePicker` | `fixedWeeks` | `hasFixedWeeks` |
| `FieldWrapper` | `wrap` | `isWrapped` |
| `TimeField` | `stepSnapping` | `hasStepSnapping` |
| `KeyboardShortcut` / `KeyboardShortcutKey` | `enableKeyHoldVisualization` | `isKeyHoldVisualizationEnabled` |
| `Select` | `keepDropdownOpenOnSelect` | `isDropdownKeptOpenOnSelect` |
| `ActionContextMenuItem` | `closeOnSelect` | `isClosedOnSelect` |
| `ActionContextMenu` / `ActionDropdownMenu` / `ActionTrigger` | `currentContextOnly` | `isCurrentContextOnly` |
| `ActionDropdownMenuItem` | `closeOnSelect` | `isClosedOnSelect` |
| `ContextMenu` / `DropdownMenu` / `Popover` | `prioritizePosition` | `isPrioritizedPosition` |

### `no*` → inverted `is*`

| Component | Old prop | New prop | Note |
|---|---|---|---|
| `BadgeGroup` | `noWrap` | `isWrapped` | **Logic inverted** — default changed from `false` to `true`. Replace `:no-wrap="true"` with `:is-wrapped="false"`. |

### Type field renames

| Type | Old field | New field |
|---|---|---|
| `Toast` | `dismissible` | `isDismissible` |
| `TableColumn` | `centerHeaderContent` | `isCenteredHeaderContent` |
| `TableGroupedData` / `TableSubGroupedData` | `defaultOpen` | `isOpenByDefault` |
