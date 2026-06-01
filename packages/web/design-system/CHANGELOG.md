# Changelog

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
