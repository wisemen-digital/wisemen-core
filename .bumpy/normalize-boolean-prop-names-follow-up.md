---
"@wisemen/vue-core-design-system": patch
---

Normalize additional boolean prop names to `is*`/`has*` convention, filling gaps missed by the initial normalization pass.

Old prop names are still supported but marked as `@deprecated` — they will be removed in a future major release.

| Component | Old prop (deprecated) | New prop |
|---|---|---|
| `TextField` / `TextareaField` / `NumberField` / `Select` / `Autocomplete` / `TagsField` / `DateField` / `TimeField` / `DateRangeField` / `PhoneNumberField` / `FormFileUpload` / `Checkbox` / `Switch` / `RadioGroup` (via shared `InputWrapper` type) | `hideErrorMessage` | `isErrorMessageHidden` |
| `MainSidebarNavigationSubItem` | `noIndent` | `isIndented` (inverted, defaults to `true`) |
| `FormDialog` / `Form` | `promptOnUnsavedChanges` | `isUnsavedChangesPromptEnabled` |
| `FormDialog` | `renderOwnFormComponent` | `hasOwnFormComponent` |
| `TagsField` | `addOnBlur` | `isAddedOnBlur` |
| `TagsField` | `addOnPaste` | `isAddedOnPaste` |
| `TagsField` | `addOnTab` | `isAddedOnTab` |
| `TagsField` | `allowDuplicate` | `isDuplicateAllowed` |
