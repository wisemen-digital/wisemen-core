# @wisemen/vue-core-actions







## 0.3.0
<sub>2026-08-25</sub>

- [#1588](https://github.com/wisemen-digital/wisemen-core/pull/1588)  *(minor)* Thanks [@JeroenVanC](https://github.com/JeroenVanC)!
  Add `tableSelection` to `ActionContext` and `useActionManagerStore`, shaped as `{ type: 'include' | 'exclude', items: string[] }`, so a data table's selection can be registered with the action manager. Adds `setTableSelection`/`clearTableSelection` to set and reset it.

## 0.2.4
<sub>2026-08-05</sub>

- [#1546](https://github.com/wisemen-digital/wisemen-core/pull/1546)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Bumped linter dependencies + adapter rules to usecases of company

## 0.2.3
<sub>2026-08-04</sub>

- [#1404](https://github.com/wisemen-digital/wisemen-core/pull/1404)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Improve scoring algorithm

## 0.2.2
<sub>2026-07-14</sub>

- [#1423](https://github.com/wisemen-digital/wisemen-core/pull/1423)  *(patch)* Thanks [@wouterlms](https://github.com/wouterlms)! - Reduce debounce from 200ms to 80ms for menus

## 0.2.1
<sub>2026-06-30</sub>

- [#1321](https://github.com/wisemen-digital/wisemen-core/pull/1321)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump dependencies to resolve vulnerabilities

## 0.2.0
<sub>2026-06-08</sub>

- [#1228](https://github.com/wisemen-digital/wisemen-core/pull/1228)  *(minor)* Thanks [@wouterlms](https://github.com/wouterlms)! - Add bottom slot to ActionContextMenu and ActionDropdownMenu for custom footer content; add settings and application action groups; fix filter input visibility to use sr-only instead of v-if so keyboard-initiated typing is captured immediately

## 0.1.3

### Patch Changes

- [#1098](https://github.com/wisemen-digital/wisemen-core/pull/1098) [`5c26828`](https://github.com/wisemen-digital/wisemen-core/commit/5c268289a865f43c12cbaa5b64e9f0bd70c0858a) Thanks [@wouterlms](https://github.com/wouterlms)! - fix: subActions no longer crash when opening menus

## 0.1.2

### Patch Changes

- [#1058](https://github.com/wisemen-digital/wisemen-core/pull/1058) [`2654ffc`](https://github.com/wisemen-digital/wisemen-core/commit/2654ffc638375858b8e7023f4ce0062123131299) Thanks [@wouterlms](https://github.com/wouterlms)! - Resolve issue where sub actions are applicable when their parent is not applicable

## 0.1.1

### Patch Changes

- [#1047](https://github.com/wisemen-digital/wisemen-core/pull/1047) [`c79086b`](https://github.com/wisemen-digital/wisemen-core/commit/c79086bff6820bf244c2397a9b236a9b60cc5382) Thanks [@wouterlms](https://github.com/wouterlms)! - Initial release

## 0.1.0

### Minor Changes

- [#993](https://github.com/wisemen-digital/wisemen-core/pull/993) [`830de68`](https://github.com/wisemen-digital/wisemen-core/commit/830de68520b5464284f2b96cdb9f8331e51099c6) Thanks [@wouterlms](https://github.com/wouterlms)! - Actions: initial release
