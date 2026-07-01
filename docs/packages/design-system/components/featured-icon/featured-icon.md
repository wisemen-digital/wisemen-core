<script setup lang="ts">
import Preview from '@/ui/featured-icon/stories/FeaturedIconPlayground.vue'

</script>

# Featured Icon

Icon displayed inside a styled container with color and variant options.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-featuredicon--default)

## Usage

Pass a Vue icon component to `icon`. Choose a `color` and optionally a `size` and `variant`.

```vue
<script setup lang="ts">
import { CheckCircleIcon } from '@wisemen/vue-core-icons'
import { UIFeaturedIcon } from '@wisemen/vue-core'
</script>

<template>
  <UIFeaturedIcon :icon="CheckCircleIcon" color="success" size="md" />
</template>
```

## API

<!-- @include: ./featured-icon-meta.md -->
