# Changelog












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
