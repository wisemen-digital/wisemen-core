# Formango — Skill Spec

Formango is a headless, type-safe Vue 3 form validation library. It uses the Standard Schema spec (supporting Zod, Valibot, ArkType) to drive schema-based validation, field registration, error tracking, and form submission — all with full TypeScript inference from the schema.

## Domains

| Domain               | Description                                                                                   | Skills                        |
| -------------------- | --------------------------------------------------------------------------------------------- | ----------------------------- |
| Form Creation & Field Binding | Defining schemas, creating forms with useForm, registering fields, binding to UI   | form-setup                    |
| Dynamic Collections  | Managing array-type form data with registerArray — add, remove, reorder, render dynamic lists  | array-fields                  |
| Validation & Errors  | Schema-driven validation, error display, external errors, i18n, conditional validation         | validation-errors             |

## Skill Inventory

| Skill               | Type | Domain              | What it covers                                                        | Failure modes |
| -------------------- | ---- | ------------------- | --------------------------------------------------------------------- | ------------- |
| form-setup           | core | form-binding        | useForm, register, Field, toFormField, subforms, Standard Schema      | 5             |
| array-fields         | core | dynamic-collections | registerArray, FieldArray, fields iteration, array methods            | 4             |
| validation-errors    | core | validation-errors   | errors, formatErrorsToZodFormattedError, addErrors, isDirty, i18n     | 3             |

## Failure Mode Inventory

### Form Setup & Field Binding (5 failure modes)

| # | Mistake                                       | Priority | Source                     | Cross-skill? |
| - | --------------------------------------------- | -------- | -------------------------- | ------------ |
| 1 | Destructuring form from useForm (v2 pattern)  | CRITICAL | CHANGELOG.md v3.0.0       | —            |
| 2 | Using onSubmitForm instead of onSubmit         | CRITICAL | CHANGELOG.md v3.0.0       | —            |
| 3 | Accessing field values without .value          | HIGH     | src/types/form.type.ts     | —            |
| 4 | Not passing Field to subform component         | CRITICAL | docs subforms.md           | —            |
| 5 | Using initialData instead of initialState      | HIGH     | src/lib/useForm.ts         | —            |

### Array Fields (4 failure modes)

| # | Mistake                                        | Priority | Source                     | Cross-skill? |
| - | ---------------------------------------------- | -------- | -------------------------- | ------------ |
| 1 | Using register instead of registerArray        | CRITICAL | docs field-array.md        | —            |
| 2 | Using array index as v-for key                 | HIGH     | docs field-array.md        | —            |
| 3 | Registering array children with wrong path     | HIGH     | docs field-array.md        | —            |
| 4 | Mutating array directly instead of methods     | HIGH     | src/lib/useForm.ts         | —            |

### Validation & Error Handling (3 failure modes)

| # | Mistake                                        | Priority | Source                     | Cross-skill? |
| - | ---------------------------------------------- | -------- | -------------------------- | ------------ |
| 1 | Passing raw errors to ZodFormattedError consumers | HIGH  | docs field.md              | form-setup   |
| 2 | Confusing isDirty and isChanged                | MEDIUM   | src/types/form.type.ts     | form-setup   |
| 3 | Calling addErrors with wrong path format       | HIGH     | docs external-errors.md    | —            |

## Tensions

| Tension                                        | Skills                                | Agent implication                                              |
| ---------------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| Headless flexibility vs. boilerplate           | form-setup ↔ validation-errors        | Agent generates fields without a toFormField mapper            |
| Standard Schema generality vs. Zod-specific    | form-setup ↔ validation-errors        | Agent uses Zod-specific helpers with non-Zod schemas           |

## Cross-References

| From              | To                  | Reason                                                           |
| ----------------- | ------------------- | ---------------------------------------------------------------- |
| form-setup        | array-fields        | Forms with dynamic lists need registerArray                      |
| form-setup        | validation-errors   | Every form needs error display via toFormField mapper            |
| array-fields      | validation-errors   | Array field errors are scoped per-item                           |

## Subsystems & Reference Candidates

| Skill              | Subsystems | Reference candidates |
| ------------------ | ---------- | -------------------- |
| form-setup         | —          | —                    |
| array-fields       | —          | —                    |
| validation-errors  | —          | —                    |

## Remaining Gaps

No remaining gaps — all questions resolved in interview.

## Recommended Skill File Structure

- **Core skills:** form-setup, array-fields, validation-errors
- **Framework skills:** none needed (Vue 3 only)
- **Lifecycle skills:** none needed (library is small enough that form-setup covers getting started)
- **Composition skills:** none needed (Zod integration is covered within core skills)
- **Reference files:** none needed (API surface is small)

## Composition Opportunities

| Library   | Integration points                     | Composition skill needed? |
| --------- | -------------------------------------- | ------------------------- |
| Zod       | Schema definition, refine, error maps  | No — covered in core      |
| Valibot   | Schema definition via Standard Schema  | No — covered in core      |
| ArkType   | Schema definition via Standard Schema  | No — covered in core      |
| vue-i18n  | Zod custom error map for translations  | No — covered in validation-errors |
