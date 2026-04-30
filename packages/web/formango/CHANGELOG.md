# Formango

## 3.2.4

### Patch Changes

- [#849](https://github.com/wisemen-digital/wisemen-core/pull/849) [`e21a3cc`](https://github.com/wisemen-digital/wisemen-core/commit/e21a3cc10a0d6a100fc17f663dea06d44b23b41f) Thanks [@Robbe95](https://github.com/Robbe95)! - Added formango skills

## 3.2.3

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 3.2.2

### Patch Changes

- [#665](https://github.com/wisemen-digital/wisemen-core/pull/665) [`8f075e2`](https://github.com/wisemen-digital/wisemen-core/commit/8f075e27d9d3c637ea633f5e36f72fb53362287f) Thanks [@Robbe95](https://github.com/Robbe95)! - Updated linter

## 3.2.1

### Patch Changes

- 347cf1a: Bumped dependency versions

## 3.0.0

### Major changes

- Form is now the root object that is returned by useForm, instead { form, ... }
- Added onSubmitError callback to useForm, which passes the data and errors to the callback function
- Added onSubmit callback to useForm, which passes the data to the callback function
- Added rawErrors to useForm, which is an array of objects with a message and path, which are the raw errors from StandardSchemaV1
- Added formatErrorsToZodFormattedError to format the errors to ZodFormattedError, which can handle both FormattedError and StandardSchemaV1 Issues
- Added reset function to useForm, which resets the form to the initial state
- Removed the onSubmitFormError callback from useForm, as it is now handled by onSubmitError
- Removed the onSubmitForm callback from useForm, as it is now handled by onSubmit
- Refactored internal code to use StandardSchemaV1 instead of Zod
- Refactored internal code to use Ref and ComputedRef instead of Reactive
- Refactored errors to custom formatting, that is an array of objects with a message and path

## 2.0.34

### Minor changes

- Allow for nested object values to be nullable in initialState

## 2.0.25

### Major changes

- Reimplemented vue devtools

## 2.0.0

### Major Changes

- Implemented Register function on the Field object and the FieldArray object, meaning you create subforms more easily. Visit the [documentation](https://wisemen-digital.github.io/vue-formango/examples/subforms) for an example.
- Changed the useForm API to use a single object. For future updates / features the API doesn't need breaking changes this way.
- Added tests.
- Refactored library based on tests.
- Updated docs for 2.0 and added more examples.
