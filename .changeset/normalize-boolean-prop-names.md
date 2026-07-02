---
"@wisemen/vue-core-design-system": minor
---

Normalize all boolean prop names to `is*` / `has*` prefix convention

All old prop names are still supported but marked as `@deprecated` — they will be removed in a future major release. Update your usage when convenient.

### `show*` → `has*`

| Component / Props file | Old prop (deprecated) | New prop |
|---|---|---|
| `Dialog` | `showCloseButton` | `hasCloseButton` |
| `DialogFooter` | `showSeparator` | `hasSeparator` |
| `DialogHeader` | `showSeparator` | `hasSeparator` |
| `DashboardPageDetailPaneFooter` | `showSeparator` | `hasSeparator` |
| `DashboardPageDetailPaneHeader` | `showSeparator` | `hasSeparator` |
| `DateRangePicker` | `showPresets` | `hasPresets` |
| `NumberField` | `showControls` | `hasControls` |
| `DateRangeFieldCalendarHeader` | `showNext` | `hasNext` |

### `hide*` → `is*Hidden`

| Component / Props file | Old prop (deprecated) | New prop |
|---|---|---|
| `DialogHeader` | `hideDescription` | `isDescriptionHidden` |

### `disable*` / `prevent*` → `is*Disabled`

| Component / Props file | Old prop (deprecated) | New prop |
|---|---|---|
| `ContextMenu` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
| `DropdownMenu` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
| `Popover` | `disableUpdateOnLayoutShift` | `isUpdateOnLayoutShiftDisabled` |
| `Popover` | `disableSideFlip` | `isSideFlipDisabled` |
| `Text` | `disableTooltip` | `isTooltipDisabled` |
| `Tooltip` | `disableCloseOnTriggerClick` | `isCloseOnTriggerClickDisabled` |
| `Tooltip` | `disableHoverableContent` | `isHoverableContentDisabled` |
| `ActionTooltip` | `disableCloseOnTriggerClick` | `isCloseOnTriggerClickDisabled` |
| `DialogFooterButton` | `disableAutoFocus` | `isAutoFocusDisabled` |
| `Table` (root props) | `disableColumnResize` | `isColumnResizeDisabled` |
| `TableScrollContainer` | `disableScroll` | `isScrollDisabled` |
| `FormSubmitButton` | `disableKeyboardShortcut` | `isKeyboardShortcutDisabled` |
| `DropdownMenu` | `fixedContentPosition` | `isContentPositionFixed` |
| `Dialog` | `preventClickOutside` | `isClickOutsideDisabled` |
| `Dialog` | `preventEsc` | `isEscDisabled` |

### Other verb/noun patterns → `is*` / `has*`

| Component / Props file | Old prop (deprecated) | New prop |
|---|---|---|
| `SkeletonItem` | `animate` | `isAnimated` |
| `DatePicker` | `fixedWeeks` | `hasFixedWeeks` |
| `FieldWrapper` | `wrap` | `isWrapped` |
| `TimeField` | `stepSnapping` | `hasStepSnapping` |
| `KeyboardShortcut` / `KeyboardShortcutKey` | `enableKeyHoldVisualization` | `isKeyHoldVisualizationEnabled` |
| `Select` / `SelectDropdown` | `keepDropdownOpenOnSelect` | `isDropdownKeptOpenOnSelect` |
| `ActionContextMenu` | `currentContextOnly` | `isCurrentContextOnly` |
| `ActionTrigger` | `currentContextOnly` | `isCurrentContextOnly` |
| `ActionDropdownMenu` | `currentContextOnly` | `isCurrentContextOnly` |
| `ContextMenu` | `prioritizePosition` | `isPrioritizedPosition` |
| `DropdownMenu` | `prioritizePosition` | `isPrioritizedPosition` |
| `Popover` | `prioritizePosition` | `isPrioritizedPosition` |

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
