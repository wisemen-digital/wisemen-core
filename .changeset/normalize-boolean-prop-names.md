---
"@wisemen/vue-core-design-system": major
---

Normalize all boolean prop names to `is*` / `has*` prefix convention

## Breaking changes

### `show*` → `has*`

| Component / Props file | Old prop | New prop |
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

| Component / Props file | Old prop | New prop |
|---|---|---|
| `DialogHeader` | `hideDescription` | `isDescriptionHidden` |

### `disable*` / `prevent*` → `is*Disabled`

| Component / Props file | Old prop | New prop |
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

| Component / Props file | Old prop | New prop |
|---|---|---|
| `SkeletonItem` | `animate` | `isAnimated` |
| `DatePicker` | `fixedWeeks` | `hasFixedWeeks` |
| `FieldWrapper` | `wrap` | `isWrapped` |
| `TimeField` | `stepSnapping` | `hasStepSnapping` |
| `KeyboardShortcut` / `KeyboardShortcutKey` | `enableKeyHoldVisualization` | `isKeyHoldVisualizationEnabled` |
| `Select` / `SelectDropdown` | `keepDropdownOpenOnSelect` | `isDropdownKeptOpenOnSelect` |
| `ActionContextMenuItem` | `closeOnSelect` | `isClosedOnSelect` |
| `ActionContextMenu` | `currentContextOnly` | `isCurrentContextOnly` |
| `ActionTrigger` | `currentContextOnly` | `isCurrentContextOnly` |
| `ActionDropdownMenuItem` | `closeOnSelect` | `isClosedOnSelect` |
| `ActionDropdownMenu` | `currentContextOnly` | `isCurrentContextOnly` |
| `ContextMenu` | `prioritizePosition` | `isPrioritizedPosition` |
| `DropdownMenu` | `prioritizePosition` | `isPrioritizedPosition` |
| `Popover` | `prioritizePosition` | `isPrioritizedPosition` |

### `no*` → inverted `is*`

| Component | Old prop | New prop | Logic change |
|---|---|---|---|
| `BadgeGroup` | `noWrap` | `isWrapped` | **Inverted** — default changed from `false` to `true`. Replace `:no-wrap="true"` with `:is-wrapped="false"`. |

### Type changes

| Type | Old field | New field |
|---|---|---|
| `Toast` | `dismissible` | `isDismissible` |
| `TableColumn` | `centerHeaderContent` | `isCenteredHeaderContent` |
| `TableGroupedData` / `TableSubGroupedData` | `defaultOpen` | `isOpenByDefault` |
