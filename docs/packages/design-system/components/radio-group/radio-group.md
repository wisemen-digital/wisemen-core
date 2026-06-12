<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/radio-group/stories/RadioGroupPlayground.vue'

</script>

# Radio Group

Single-choice group for selecting one value from a short option set.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-radiogroup--default)

## Usage

Wrap `UIRadioGroupItem` entries inside `UIRadioGroupRoot`. Bind the selected value with `v-model`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIRadioGroupItem, UIRadioGroupRoot } from '@wisemen/vue-core'

const selected = ref<string | null>(null)
</script>

<template>
  <UIRadioGroupRoot v-model="selected" orientation="vertical">
    <div class="flex flex-col gap-3">
      <UIRadioGroupItem label="Option 1" value="option1" />
      <UIRadioGroupItem label="Option 2" value="option2" />
      <UIRadioGroupItem label="Option 3" value="option3" />
    </div>
  </UIRadioGroupRoot>
</template>
```

### Card variant

Use `UIRadioGroupItemCard` for a card-style radio option with richer layout support.

## API

<!-- @include: ./radio-group-meta.md -->
