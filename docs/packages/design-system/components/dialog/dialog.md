<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/dialog/stories/DialogPlayground.vue'

</script>

# Dialog

Modal dialog shell for focused tasks, confirmations, and blocking flows.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-dialog--default)

## Usage

A dialog is composed of a root `UIDialog`, a `UIDialogHeader`, a `UIDialogBody`, and a `UIDialogFooter`. Control visibility via `v-model:isOpen`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleIcon } from '@wisemen/vue-core-icons'
import {
  UIDialog,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterPrimary,
  UIDialogHeader,
} from '@wisemen/vue-core'

const isOpen = ref(false)
</script>

<template>
  <UIButton label="Open dialog" @click="isOpen = true" />

  <UIDialog v-model:is-open="isOpen" size="md">
    <UIDialogHeader
      :icon="CheckCircleIcon"
      title="Confirm action"
      description="Are you sure you want to proceed?"
    />

    <UIDialogBody>
      <!-- dialog content -->
    </UIDialogBody>

    <UIDialogFooter>
      <template #right>
        <UIDialogFooterCancel label="Cancel" @click="isOpen = false" />
        <UIDialogFooterPrimary label="Confirm" @click="isOpen = false" />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
```

## API

<!-- @include: ./dialog-meta.md -->
