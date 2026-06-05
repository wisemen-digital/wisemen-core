---
name: array-fields
description: >
  Use form.registerArray() to manage dynamic field lists in formango.
  Covers FieldArray interface: iterate fields with v-for using unique ids
  as keys, register child fields by index, manipulate with append, remove,
  insert, prepend, pop, shift, move, empty, setValue.
type: core
library: formango
requires:
  - form-setup
---

# Formango — Array Fields

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'formango'
import { UITextField } from '@wisemen/vue-core-design-system'
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
    <UITextField v-bind="toFormField(emails.register(`${index}`))" label="Email" />
    <button @click="emails.remove(index)">Remove</button>
  </div>
  <button @click="emails.append()">Add email</button>
</template>
```

## Examples

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
import { UITextField, UICheckbox } from '@wisemen/vue-core-design-system'

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
  <UITextField v-bind="toFormField(title)" label="Title" />
  <UICheckbox v-bind="toFormField(completed)" label="Completed" />
</template>
```

### FieldArray state properties

```ts
const emails = form.registerArray('emails')

emails.fields.value        // string[] — unique ids for v-for :key
emails.modelValue.value    // current array value
emails.isDirty.value       // true if array differs from initial state
emails.isTouched.value     // true if any child field was blurred
emails.isValid.value       // true if no validation errors on array or children
emails.errors.value        // FormattedError[] — errors for this array and children
```

## See Also

- [form-setup](../form-setup/SKILL.md) — base form creation and field registration
- [validation-errors](../validation-errors/SKILL.md) — array field errors are scoped per-item
