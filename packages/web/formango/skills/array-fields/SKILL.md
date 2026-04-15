---
name: array-fields
description: >
  Use form.registerArray() to manage dynamic field lists in formango.
  Covers FieldArray interface: iterate fields with v-for using unique ids
  as keys, register child fields by index, manipulate with append, remove,
  insert, prepend, pop, shift, move, empty, setValue. Nested arrays via
  fieldArray.registerArray(). Load when a form schema contains z.array()
  or any repeatable field group.
type: core
library: formango
library_version: "3.2.1"
requires:
  - form-setup
sources:
  - "wisemen-digital/wisemen-core:packages/web/formango/src/lib/useForm.ts"
  - "wisemen-digital/wisemen-core:packages/web/formango/src/types/form.type.ts"
  - "wisemen-digital/wisemen-core:docs/packages/formango/api/field-array.md"
---

This skill builds on [form-setup](../form-setup/SKILL.md). Read it first for `useForm`, `register`, and `Field` concepts.

# Formango — Array Fields

## Setup

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { z } from 'zod'

const formSchema = z.object({
  emails: z.array(z.string().email()),
})

const form = useForm({
  schema: formSchema,
  onSubmit: (data) => {
    // data.emails is string[]
  },
})

const emails = form.registerArray('emails')
</script>

<template>
  <div v-for="(emailField, index) in emails.fields" :key="emailField">
    <EmailInput :emails="emails" :index="index" />
    <button @click="emails.remove(index)">Remove</button>
  </div>
  <button @click="emails.append()">Add email</button>
</template>
```

```vue
<!-- EmailInput.vue -->
<script setup lang="ts">
import type { FieldArray } from 'formango'

const { emails, index } = defineProps<{
  emails: FieldArray<string>
  index: number
}>()

const email = emails.register(`${index}`)
</script>

<template>
  <CustomInput v-bind="toFormField(email)" />
</template>
```

## Core Patterns

### Array manipulation methods

```ts
const items = form.registerArray('items')

items.append({ name: 'New item' })         // add to end
items.prepend({ name: 'First item' })       // add to beginning
items.insert(2, { name: 'At index 2' })     // insert at position
items.remove(0)                              // remove at index
items.pop()                                  // remove last
items.shift()                                // remove first
items.move(0, 2)                             // swap positions of index 0 and 2
items.empty()                                // remove all items
items.setValue([{ name: 'Reset' }])          // replace entire array
```

### Register child fields inside array items

Each array item is registered by its index as a string, relative to the `FieldArray`. For object arrays, chain `register` on the item field.

```vue
<script setup lang="ts">
import type { FieldArray } from 'formango'

interface TodoItem {
  title: string
  completed: boolean
}

const { todos, index } = defineProps<{
  todos: FieldArray<TodoItem>
  index: number
}>()

const item = todos.register(`${index}`)
const title = item.register('title')
const completed = item.register('completed')
</script>

<template>
  <CustomInput v-bind="toFormField(title)" />
  <CustomCheckbox v-bind="toFormField(completed)" />
</template>
```

### FieldArray state properties

```ts
const emails = form.registerArray('emails')

emails.fields.value        // string[] — unique ids for v-for :key
emails.modelValue.value    // current array value
emails.value.value         // alias for modelValue
emails.isDirty.value       // true if array differs from initial state
emails.isTouched.value     // true if any child field was blurred
emails.isValid.value       // true if no validation errors on array or children
emails.errors.value        // FormattedError[] — errors for this array and children
emails.rawErrors.value     // StandardSchemaV1.Issue[] — raw validation issues
```

## Common Mistakes

### CRITICAL Using register instead of registerArray for arrays

Wrong:

```ts
const emails = form.register('emails')
// emails is Field<string[]>, not FieldArray<string>
// emails.append is undefined — no array methods available
```

Correct:

```ts
const emails = form.registerArray('emails')
// emails is FieldArray<string> — has append, remove, insert, etc.
emails.append('new@email.com')
```

Schema fields defined with `z.array()` must use `registerArray`, not `register`. Using `register` creates a single `Field` without array manipulation methods.

Source: docs/packages/formango/api/field-array.md

### HIGH Using array index as v-for key instead of field id

Wrong:

```vue
<div v-for="(_, index) in emails.fields" :key="index">
  <EmailInput :emails="emails" :index="index" />
</div>
```

Correct:

```vue
<div v-for="(emailField, index) in emails.fields" :key="emailField">
  <EmailInput :emails="emails" :index="index" />
</div>
```

`FieldArray.fields` provides unique string ids for each item. Using the numeric index as `:key` causes Vue to reuse wrong DOM elements when items are removed or reordered, leading to stale field state.

Source: docs/packages/formango/api/field-array.md

### HIGH Registering array children with wrong path syntax

Wrong:

```ts
// Inside a child component receiving the FieldArray
const email = emails.register(`emails.${index}`)
// path is relative to FieldArray, not the form root
```

Correct:

```ts
const email = emails.register(`${index}`)
// just the index — FieldArray already knows its own root path
```

When calling `register` on a `FieldArray`, the path is relative to the array. Passing the full path from the form root doubles the prefix and creates a disconnected field.

Source: docs/packages/formango/api/field-array.md — ExampleArrayField.vue

### HIGH Mutating array directly instead of using FieldArray methods

Wrong:

```ts
emails.modelValue.value.push('new@email.com')
// bypasses internal path tracking — form state becomes inconsistent
```

Correct:

```ts
emails.append('new@email.com')
```

Direct mutation bypasses formango's internal path management, field id tracking, and reactivity system. Always use `append`, `remove`, `insert`, and other `FieldArray` methods to modify array contents.

Source: src/lib/useForm.ts — createFieldArray

See also: [form-setup](../form-setup/SKILL.md) — base form creation and field registration

See also: [validation-errors](../validation-errors/SKILL.md) — array field errors are scoped per-item

## Version

Targets formango v3.2.1.
