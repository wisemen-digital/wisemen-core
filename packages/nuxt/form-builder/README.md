# Nuxt form builder

The linked frontend for `@repo/payload-form-builder`. Add it to a Nuxt app, provide the form document and one submit function, and it renders the fields, validates browser-side values, handles loading/errors, and displays the configured success message.

It uses Formango for field state and schema validation, and Nuxt UI for its default controls. Both are peer dependencies so consuming apps retain control over their versions and theming.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
})
```

`@nuxt/ui` must be enabled by the consuming Nuxt application. The form builder
imports Nuxt UI components explicitly (rather than relying on Nuxt auto-imports),
so the consumer's Nuxt UI module, app config, and generated theme CSS are used.
Keep `@nuxt/ui` installed in the consuming application; it is a peer dependency
of this package.

```vue
<script setup lang="ts">
import type { RenderableForm } from '@repo/nuxt-form-builder/types'

const props = defineProps<{ form: RenderableForm }>()
const toast = useToast()

async function submit(values: Record<string, boolean | number | string | null>) {
  return $fetch('/api/forms/submit', {
    method: 'POST',
    body: { form: props.form.id, data: values },
  })
}

function onError() {
  toast.add({ title: 'Could not send your form.', color: 'error' })
}
</script>

<template>
  <FormBuilder
    :form="form"
    :submit="submit"
    @error="onError"
  />
</template>
```

Use the `field`, `actions`, and `success` slots when a project needs a custom presentation. The package does not know about the API transport or authentication; the supplied `submit` function owns that boundary.
