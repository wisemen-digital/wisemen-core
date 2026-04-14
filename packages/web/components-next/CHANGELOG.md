# @wisemen/vue-core-components

## 3.0.1

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 3.0.0

### Major Changes

- [#808](https://github.com/wisemen-digital/wisemen-core/pull/808) [`d295b6b`](https://github.com/wisemen-digital/wisemen-core/commit/d295b6b9ad0dd749b779f55dcea787f457ba7adf) Thanks [@NickBanken](https://github.com/NickBanken)! - addition of dontCloseOnSelect prop for DateField and DateRangeField

### Patch Changes

- [#665](https://github.com/wisemen-digital/wisemen-core/pull/665) [`8f075e2`](https://github.com/wisemen-digital/wisemen-core/commit/8f075e27d9d3c637ea633f5e36f72fb53362287f) Thanks [@Robbe95](https://github.com/Robbe95)! - Updated linter

## 2.2.3

### Patch Changes

- f5bddce: Ran updated linter
- fce3eff: Updated linter dependency

## 2.2.2

### Patch Changes

- 45082dc: Addition of start- and end date clamping to avoid complete freedom when there are restrictions with min- and max dates
- 546d87d: Add `isPublic` prop to FileUpload component to allow users to specify if the uploaded file should be public or private.
  This prop will be used to set the appropriate permissions when uploading the file to the server.
- d5d31a7: Autocomplete - fill in search term when modelvalue is passed
- 6f55f64: Fix default vallue null check in autocomplete

## 2.1.4

### Patch Changes

- f5311b7: Add locale and weekStartsOn props to DateRangePicker

## 2.1.3

### Patch Changes

- 6b01189: Refactored rendering of icon to prevent memory leak in nuxt
- Date: fix issues where the first day of the week would be calculated incorrectly in the Calendar and DatePicker components
- 347cf1a: Bumped dependency versions

## 2.1.1

### Patch Changes

- Autocomplete: fix an issue where the value could never be cleared

## 2.1.0

### Minor Changes

- FileUpload: add `preprocess` function to transform a file before upload

## 2.0.3

### Patch Changes

- **Select**: add value for screen readers

## 2.0.2

### Patch Changes

- Use browser locale for date-related components

## 2.0.1

### Patch Changes

- **Dialog**: resolve an issue where state would persist after reopening a dialog

## 2.0.0

### ✨ Improvements

- **DropdownMenu, Popover, Tooltip**: Refined transitions for smoother and more consistent animations across components.

### 🐞 Bug Fixes

- **Popover**: Ensured popovers respect the available viewport height by applying a dynamic `max-height`.
- **Select**: Fixed an accessibility issue where the `id` was applied to the wrong element, preventing the Select from being properly accessible.
- **Table**: Resolved an accessibility issue where row actions did not have a readable label for screen readers.
- **Dialog**: Fixed an issue where opening a new dialog from within another caused the first dialog to unmount unexpectedly.
- **NumberField**: Now inherits the locale from the user's browser (`navigator.locale`) instead of the configured locale, ensuring a more intuitive number format by default.

## 2.0.0-beta.2

### ✨ Improvements

- **Toast**: Added logic to suppress duplicate toasts with the same title and description, preventing repetitive notifications.

### 🐞 Patch Fixes

- **Toast**: Added `closeButton` to `classConfig` for easier styling customization.
- **AddressAutocomplete**: Propagated slots correctly to support advanced slot composition.
- **Props export**: Fixed issue where props with complex types required `@vue-ignore` when extending components — props are now exported in a more type-safe way.
- **DatePicker / DateRangePicker**: Fixed incorrect month display labels.
- **ClassConfig**: Resolved multiple internal issues with the `classConfig` prop to ensure reliable class merging and customization.

## 2.0.0-beta.1

### 🐞 Patch Fixes

- **Temporal migration**: Refactored leftover `Date` usage to fully adopt the Temporal API.
- **Styling**: Fixed an issue where `class-config` classes could be overwritten by `defineComponentVariant` classes, ensuring custom styles are applied correctly.

## 2.0.0-beta.0

### ⚠️ Breaking Changes

- **Composables**: Renamed to remove the `vc` prefix.

  > **Upgrade Note:** Update all imports from `vcXyz` to `Xyz`. Example:
  >
  > ```ts
  > // Before
  > import { useVcDialog, useVcToast } from "@wisemen/vue-core-components";
  > // After
  > import { useDialog, useToast } from "@wisemen/vue-core-components";
  > ```

- **useDialog**:
  - Now accepts a Vue component directly instead of options.
  - `open()` no longer supports an optional `id` parameter.
  - `close()` no longer supports an optional `id` parameter.
  - `getTriggerProps()` replaced with the computed property `triggerProps`.
  - `isOpen()` replaced with the computed property `isOpen`.
    > **Upgrade Note:** Refactor dialog usage to use the new component-based API. Replace calls to `open(id)` and `close(id)` with just `open()` and `close()`. Use `triggerProps` and `isOpen` computed values instead of the old methods.
    >
    > ```ts
    > // Before
    > const dialog = useVcDialog({
    >   component: () => import("./MyDialogComponent.vue"),
    > });
    > // After
    > const dialog = useDialog(MyDialogComponent);
    > ```

- **Date handling**: Migrated from `Date` to the [Temporal API](https://tc39.es/proposal-temporal/).

  > **Upgrade Note:** Review all components or composables that previously relied on `Date` objects and update them to use `Temporal.PlainDate`, `Temporal.PlainDateTime`, or `Temporal.ZonedDateTime` as appropriate.

- **Table**: `TableNext` has been renamed to `Table`, and the legacy `Table` components have been removed.
  > **Upgrade Note:** Replace all `TableNext` imports and usage with `Table`. Remove any code referencing the old `Table` components.

### ✨ Improvements

- **ThemeProvider**: Moved from Portal components to PopperContent components for better integration.
- **DropdownMenu**: Added `onCloseAutoFocus` and `onEscapeKeyDown` events for finer control over interactions.
- **ThemeProvider**: Added `as-child` prop to apply the theme directly to the child component instead of wrapping it in a `div`.
- **ConfigProvider**: Now exports its config context for advanced customization.

## 1.17.0

### 🔥 New Features

- **ConfigProvider**: Added `hourCycle` prop to control 12h/24h time formatting across components.

### 🐞 Bug Fixes

- **Select**: Adjusted dropdown width to better fit its content.
- **Button**: Removed unused emits to ensure proper event propagation.

## 1.16.0

### ✨ Improvements

- **Popover, Tooltip, DropdownMenu, Select**: Improved transitions by reducing duration and bounce for smoother UI animations.

### 🐞 Bug Fixes

- **General**: Fixed class merge issues that sometimes prevented overrides or required using `!important`.
- **Autocomplete**: Prevented the list from clearing when manual dropdown opening is allowed. Removed unused `filter` prop.
- **RouterLinkTabs**: Now replaces routes instead of pushing, improving navigation behavior.
- **Toast**: Fixed `auto-close-toast` prop to support more flexible customization.
- **Tooltip**: Resolved issue with `open-delay` being skipped by moving `TooltipProvider` under `ConfigProvider`.
- **DropdownMenu**: Corrected prop type export casing.

## 1.15.0

### 🔥 New Features

- **Toast**: Added support for custom duration, enabling more control over how long toasts remain visible.

### 🐞 Bug Fixes

- **RouterLinkButton**: Fixed issue with `variant` prop not being applied correctly.
- **Button**: Removed default shadow to align with updated design standards.

## 1.14.0

### 🚀 Minor Changes

- **Address**: Added support for `placeId`.

## 1.13.0

### 🔥 New Features

- **Toast**: Added support for auto-closing toasts via a new configuration option — useful for transient notifications that shouldn't require manual dismissal.
- Added `VcTableXXXNext` components which in the future will replace the existing `VcTable` components.

## 1.12.1

### 🐞 Patch Fix

- **FileUpload**: Fixed an issue that prevented successful uploads to Azure Blob Storage in certain configurations.

## 1.12.0

### ⚠️ Breaking Changes

- **FileUpload**: Some type interfaces have changed.

### 🚀 Minor Changes

- **FileUpload**: Introduced new `VcFileUploadDropzone` component and fixed multiple bugs to improve reliability and usability.

### 🐞 Patch Fixes

- **FileUpload**:
  - Fixed enum export issue (previously exported as a type).
  - Resolved a bug where the internal state and the bound value could get out of sync, resulting in duplicated file entries.

- **PhoneNumberField**:
  - Fixed issue where the country code was ignored when using an initial value.

## 1.11.0

### 🔥 New Features

- **PhoneNumberField**: Added support for `class-config` prop, allowing full customization.

## 1.10.0

### 🔥 New Features

- Improved customization support across components:
  - Exposed `hiddenResultsHint` in `classConfig` for more granular styling.
  - Added `data-first-column`, `data-last-column`, and `data-sticky` attributes to enhance layout control and state targeting.

### 🐞 Bug Fixes

- **Checkbox**: Fixed a layout shift bug that could affect alignment during rendering.
- **useKeyboardShortcut**: Improved support for the `Escape` key when used as a modifier.
- **Textarea**: Fixed the type definition for the `variant` prop to prevent TypeScript errors.

## 1.9.0

### 🔥 New Features

- **Dialog**: Updated enter and leave transitions for a smoother animation experience.

### 🐞 Bug Fixes

- **Dialog**: Removed an unintended border when in light mode.
- **FileUpload**: Cleaned up the `getFileInfo` type by stripping unused properties.

## 1.8.0

### 🔥 New Features

- **LayoutStack**: Introduced `LayoutStackRoot` and `LayoutStackItem` components to enable animated stacking of elements.

## 1.7.3

### ✨ Improvements

- **Table**: Exported internal component parts to allow more granular customization.
- **KeyboardShortcutProvider**: Now automatically disables shortcuts when any parent element has `aria-hidden`, improving accessibility behavior.

### 🐞 Bug Fixes

- **Table**: Fixed an issue in the calculation of the active filter count, ensuring accurate display.

## 1.7.2

### 🐞 Bug Fixes

- **DatePicker**, **DateRangePicker**: Fixed a reactivity issue that caused the placeholder value to not work correctly.

## 1.7.1

### ✨ Improvements

- **Table**: Added a background color to the empty and loading state.
- **Spinner**: Migrated styles to Tailwind, so there's no longer a need to import a separate stylesheet.

### 🐞 Bug Fixes

- **DatePicker**, **DateRangePicker**: Fixed an issue where the calendar incorrectly started on Tuesday instead of Monday.

## 1.7.0

### 🔥 New Features

- **Autocomplete**: Added an `items` slot to support more advanced customization.

### ✨ Improvements

- **DatePicker**, **DateRangePicker**: Now properly forward the `locale` prop for localized formats.

### 🐞 Bug Fixes

- **DateField**, **DateRangeField**: Fixed the `placeholderValue` prop to behave as expected.

## 1.6.0

### 🔥 New Features

- **Tabs**: Added horizontal scrolling with navigation arrows when content overflows.
- **Switch**: Introduced `iconChecked` and `iconUnchecked` props for customizing switch icons.

### ✨ Improvements

- **Select**:
  - Added a `badge` slot to allow custom badge implementations.
  - Truncated long values to prevent overflow.
- **PhoneNumberField**: Now sets `modelValue` to `null` when the input is empty.

### 🐞 Bug Fixes

- **Toast**: Fixed an issue where interacting with a toast while a dialog was open would unintentionally close the dialog.

## 1.5.6

### 🐞 Bug Fixes

- **build**: Fix issue with the latest deployment.

## 1.5.5

### ✨ Improvements

- **FormField**: Added an icon to error messages for improved visual feedback.
- **DateField**, **DateRangeField**: Updated `modelValue` to extend from `Date`, allowing for better type inference and consistency.
- **Table**: `TableHeaderCell` is now wrapped in a context provider, removing the need to manually pass the `column` prop.

## 1.5.4

### 🐞 Bug Fixes

- **Dialog**: Fixed a regression where `VcDialogTriggerProps` was no longer being exported.

## 1.5.3

### 🐞 Bug Fixes

- **Select**: Fixed an issue where opening the dropdown caused abrupt and incorrect scrolling.
- **Popper Components**: Ensured slot content is correctly wrapped in a `ThemeProvider` when rendered via a portal.

### ✨ Improvements

- **Select**: The `placeholder` is now fully customizable.

### ⚠️ Deprecations

- `useAppearance` has been deprecated.  
  → Please switch to using `useStorage` directly in your project.  
  This composable will be **removed in the next major release**.

## 1.5.2

### ✨ Improvements

- **TimeField**: Changed the `modelValue` type from `string` to a generic `T extends string` for improved flexibility.
- **TextField**: Prefixed component exports with `Vc` to maintain naming consistency.
- **Dialog**: Exported `VcDialogTriggerProps` type.

### 🐞 Bug Fixes

- **TextField**: Fixed issue where the input remained enabled even when `isDisabled` was set to `true`.

## 1.5.1

### 🐞 Bug Fixes

- Resolved an issue where styles were broken due to Tailwind not being properly imported.

## 1.5.0

### 🔥 New Features

- Introduced the `FileUpload` component for uploading files directly to S3.

### ✨ Improvements

- **Select**: Updated dropdown transitions to be smoother and less abrupt.
- **AddressAutocomplete**: Added support for `bus` prop.
- **Table**: Refined the empty state appearance by softening blur.
- Moved `vue-sonner` to dependencies to ensure type availability.

### 🐞 Bug Fixes

- **Select**: Fixed issue where `class-config` prop classes weren’t applied to `SelectPopover`.
- **AddressAutocomplete**: Resolved a delay where the selected value took longer than expected to appear.
- **Table**:
  - Fixed duplicate borders when content wasn’t scrollable.
  - Fixed missing borders when columns were sticky.
- **RouterLinkButton**: Resolved layout issues.

## 1.4.0

### 🔥 New Features

- Introduced the `Badge` component.
- Added a `DateRangePicker` component for selecting date intervals.
- Added a `DateRangeField` component for form-based date range input.

### ✨ Improvements

- **Dialog**: Exported the `DialogPortal` component.

### 🐞 Bug Fixes

- **Table**: Fixed accessibility issue by moving `aria-sort` to the correct column header.

---

## 1.3.1

### ✨ Improvements

- **Types**: Exported `AcceptableValue` for more flexible type support.

---

## 1.3.0

### 🔥 New Features

- Added a `Toast` component for temporary notifications such as success, error, or info messages.
- Introduced `PaginationParamsBuilder` utility for generating query parameters related to pagination.

### ✨ Improvements

- Internal types were refactored to support better customization of nested components.

### 🐞 Bug Fixes

- **Table**: Fixed issue where interactive elements in rows wouldn't function correctly when a row action was defined.

---

## 1.2.0

### 🔥 New Features

- Added a `Table` component for displaying structured data in rows and columns.

---

## 1.1.0

### 🔥 New Features

- **Tabs**: Restricted `value` and `modelValue` to accept only strings.
- **Select**: Introduced `clearSearchTermOnBlur` to reset the input automatically on blur.
- **RadioGroupItem**: Added `RadioGroupItemControl` for customizing the default indicator UI.
- **Checkbox**: Added `CheckboxControl` for customizing the default checkbox UI.
- Export the `Spinner` component.
- Reduced potential accessibility issues by limiting `id` attributes to form components only; others now use `data-test-id`.

### ✨ Improvements

- **KeyboardShortcut**: Added support for the `classConfig` prop.
- **SelectItem**: Now supports `id` and `testId` props for better testability.

### 🐞 Bug Fixes

- **Autocomplete**: Fixed issue where the search term cleared unexpectedly.
- **Select**:
  - Fixed issue where dropdown closure did not trigger blur.
  - Resolved `v-model` issues when using inline search.
- **Popover**: Prevented maximum call stack error when using native `Teleport` with `Select`.
- **Checkbox** & RadioGroupItem: Improved pointer interaction by applying pointer classes to the root element.
- **KeyboardKey**: Switched from `width` to `min-width` to accommodate wider content.
- **IconButton**: Replaced `min-width` with `width` for easier sizing.
- **Button**: Ensured `IconRight` remains visible during loading.
- **Textarea**: Fixed inconsistent height rendering in edge cases.
- **DropdownMenu**: Ensured arrow visibility when `side` is set to `top` or `bottom`.
- **PrimitiveElement**: Renamed `test-id` attribute to `data-test-id`.
- Resolved issues with components unintentionally overwriting each other when sharing the same variant name.

### ✨ Improvements

- Added customization examples for `Checkbox` and `RadioGroupItem`.

---

## 1.0.0

### 💥 Breaking Changes

- Replaced `errors` array with a single `error-message` string for simplified error handling.
- Renamed `popover-offset` to `popover-side-offset` and introduced `popover-align-offset`.

### ✨ Improvements

- **Dialog**: Refined transition properties.
- **Icon**: Added `aria-hidden` attribute.
- Updated font size for item labels in `DropdownMenu`.
- Improved popper origin transitions.
- Enabled roving focus for better accessibility in `Select` tags.
- Exported the `Icon` component for reuse.

### 📜 Documentation

- Added documentation for form component error states.
- Included usage examples for `Dialog` components.

### 🐞 Bug Fixes

- **DropdownMenu**: Fixed incorrect transition origin and destructive icon color.
- **Popover**: Fixed arrow visibility in documentation examples.
- Externalized `motion-v` dependency.
