<script setup lang="ts">
import Preview from '@/ui/tags-field/stories/TagsFieldPlayground.vue'

</script>

# Tags Field

Tags input field for entering a list of free-form string values.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-tagsfield--default)

## Usage

Bind a `string[]` with `v-model`. Tags are added by pressing Enter and removed by clicking the × on each tag.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITagsField } from '@wisemen/vue-core'

const tags = ref<string[]>([])
</script>

<template>
  <UITagsField
    v-model="tags"
    label="Tags"
    placeholder="Add a tag..."
  />
</template>
```

Use `:max="5"` to limit the number of tags, `:allow-duplicate="false"` to prevent duplicates, and `:add-on-paste="true"` to split pasted text into multiple tags using the `delimiter` (default `,`).

## API

<!-- @include: ./tags-field-meta.md -->
