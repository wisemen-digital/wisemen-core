# Changelog





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
