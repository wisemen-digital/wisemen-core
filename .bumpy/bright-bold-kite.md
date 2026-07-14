---
"@wisemen/vue-core-design-system": patch
---

Fix `FormDialog` and `DialogChin` issues:
- Pressing Esc on a dirty `FormDialog` now shows the unsaved-changes confirmation chin instead of discarding changes immediately; pressing Esc again closes the dialog and discards the changes
- Fixed a height jump/chop in the dialog chin's open animation, most noticeable when it opened at the same time as a form field's error message
- Closing a `FormDialog` with unsaved changes no longer marks every form field as touched, so validation errors no longer appear on fields the user never interacted with
