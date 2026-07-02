---
"@wisemen/vue-core-custom-views": minor
"@wisemen/vue-core-design-system": minor
"@wisemen/vue-core-filters": minor
---

Normalize all boolean prop names to `is*` / `has*` prefix convention

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
