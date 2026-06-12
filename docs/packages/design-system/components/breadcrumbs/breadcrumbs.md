<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/breadcrumbs/stories/BreadcrumbPlayground.vue'

</script>

# Breadcrumbs

Breadcrumb navigation trail for showing hierarchy and page location.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-breadcrumbs--default)

## Usage

Wrap `UIBreadcrumbItem` entries inside `UIBreadcrumbItems`, separated by `UIBreadcrumbSeparator`. The last item without a `to` prop renders as plain text (the current page).

```vue
<script setup lang="ts">
import { Home01Icon, User01Icon } from '@wisemen/vue-core-icons'
import {
  UIBreadcrumbItem,
  UIBreadcrumbItems,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core'
</script>

<template>
  <UIBreadcrumbItems>
    <UIBreadcrumbItem :icon="Home01Icon" label="Home" to="/" />
    <UIBreadcrumbSeparator />
    <UIBreadcrumbItem :icon="User01Icon" label="Users" to="/users" />
    <UIBreadcrumbSeparator />
    <UIBreadcrumbItem label="Jeroen" />
  </UIBreadcrumbItems>
</template>
```

## API

<!-- @include: ./breadcrumbs-meta.md -->
