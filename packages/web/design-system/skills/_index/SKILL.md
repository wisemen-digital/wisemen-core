---
name: design-system-index
description: >
  Master index for @wisemen/vue-core-design-system. Read this first to find the
  right skill for any component or pattern. Lists all skills organized by category
  with a decision tree for component selection.
type: index
library: vue-core-design-system
library_version: "0.8.0"
---

# @wisemen/vue-core-design-system — Skill Index

Read this skill first to route to the correct component or foundation skill.

## Foundations

Load these before working with components in their category.

| Skill | Path | Load When |
|-------|------|-----------|
| Architecture | `foundations/architecture/` | Understanding parts pattern, context system, file conventions |
| Styling | `foundations/styling/` | Customizing styles, design tokens, dark mode, tv() |
| Input System | `foundations/input-system/` | Working with any input/form component |
| Overlay System | `foundations/overlay-system/` | Working with dialogs, popovers, tooltips |
| Layout System | `foundations/layout-system/` | Building page layouts, sidebars, dashboard pages |

## Component Quick Reference

### Buttons

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIButton` | `components/button/` | Primary action trigger with label |
| `UIIconButton` | `components/button/` | Icon-only action (toolbars, compact UI) |
| `UILink` | `components/button/` | Navigation-styled button or anchor |

### Inputs

| Component | Skill | Use When |
|-----------|-------|----------|
| `UITextField` | `components/text-field/` | Single-line text: name, email, password, search, URL |
| `UITextareaField` | `components/textarea-field/` | Multi-line text input |
| `UINumberField` | `components/number-field/` | Numeric value with +/- controls |
| `UIAutocomplete` | `components/autocomplete/` | Searchable single-value selection with custom items |
| `UISelect` | `components/select/` | Single or multi-select from a list of options |

### Form Controls

| Component | Skill | Use When |
|-----------|-------|----------|
| `UICheckbox` | `components/checkbox/` | Single boolean toggle |
| `UICheckboxGroup` | `components/checkbox-group/` | Multiple checkboxes with array binding |
| `UIRadioGroup` | `components/radio-group/` | Exclusive choice from a set |
| `UISwitch` | `components/switch/` | Toggle on/off state |

### Navigation

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIBreadcrumbs` | `components/breadcrumbs/` | Page hierarchy trail |
| `UIMenuItem` | `components/menu-item/` | Row item in a menu or list |
| `UIDropdownMenu` | `components/dropdown-menu/` | Contextual action menu |
| `UITabs` | `components/tabs/` | Tabbed content navigation |

### Layout

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIRowLayout` | `components/row-layout/` | Horizontal flex container |
| `UIColumnLayout` | `components/column-layout/` | Vertical flex container |
| `UILayout` | `components/layout/` | Top-level app shell |
| `UIDashboardPage` | `components/page/` | Full dashboard page with header, actions, detail pane |
| `UIMainSidebar` | `components/sidebar/` | Main navigation sidebar |

### Overlays

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIDialog` | `components/dialog/` | Modal dialog with custom content |
| `UIConfirmDialog` | `components/confirm-dialog/` | Yes/no confirmation prompt |
| `UIFormDialog` | `components/form-dialog/` | Dialog with integrated form (internal, not in main export) |
| `UIPopover` | `components/popover/` | Floating panel anchored to trigger |
| `UITooltip` | `components/tooltip/` | Hover text tooltip |
| `UIActionTooltip` | `components/action-tooltip/` | Tooltip with label + keyboard shortcut |

### Display

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIBadge` | `components/badge/` | Colored label tag |
| `UINumberBadge` | `components/number-badge/` | Numeric count indicator |
| `UIDot` | `components/dot/` | Small colored status circle |
| `UIText` | `components/text/` | Typography with truncation detection |
| `UIAvatar` | `components/avatar/` | User avatar (image or initials) |
| `UILoader` | `components/loader/` | Loading spinner |
| `UICard` | `components/card/` | Bordered container |
| `UISeparator` | `components/separator/` | Horizontal/vertical divider |
| `UITimeline` | `components/timeline/` | Vertical activity timeline |
| `UISkeletonItem` | `components/skeleton-item/` | Loading placeholder |
| `UIAdaptiveContent` | `components/adaptive-content/` | Space-adaptive container |
| `UIScrollable` | `components/scrollable/` | Managed scroll wrapper (internal, not in main export) |
| `UIKeyboardShortcut` | `components/keyboard-shortcut/` | Keyboard key combo display |

### Infrastructure

| Component | Skill | Use When |
|-----------|-------|----------|
| `UIConfigProvider` | `components/config-provider/` | App-level config (locale, maps key, teleport) |
| `UIThemeProvider` | `components/theme-provider/` | Light/dark/system theme |
| `UIForm` | `components/form/` | Form wrapper with unsaved changes (internal, not in main export) |
| `UIClickableElement` | `components/clickable-element/` | Base clickable primitive |
| `UIInteractable` | `components/interactable/` | Base interactive wrapper |

## Decision Tree

**"I need the user to input..."**
- Text (single line) -> `text-field`
- Text (multi-line) -> `textarea-field`
- A number -> `number-field`
- A selection from a list -> `select`
- A searchable selection -> `autocomplete` (single value) or `select` (with search)
- Yes/no (inline) -> `checkbox` or `switch`
- One of several options -> `radio-group`
- Multiple of several options -> `checkbox-group`

**"I need to show..."**
- A modal -> `dialog`, `confirm-dialog`, or `form-dialog`
- A floating panel -> `popover`
- Hover help text -> `tooltip` or `action-tooltip`
- A menu of actions -> `dropdown-menu`
- A status indicator -> `dot` or `badge`
- A count -> `number-badge`
- User identity -> `avatar`
- Loading state -> `loader` or `skeleton-item`

**"I need to lay out..."**
- Items horizontally -> `row-layout`
- Items vertically -> `column-layout`
- A full page -> `page` (DashboardPage)
- App navigation -> `sidebar`
- Tabbed sections -> `tabs`

## Foundation Prerequisites

| Component Category | Required Foundation |
|---|---|
| Any input or form control | `input-system` |
| Dialog, ConfirmDialog, FormDialog | `overlay-system` |
| DashboardPage, Sidebar | `layout-system` |
| Custom styling or theming | `styling` |
| Building new components | `architecture` |
