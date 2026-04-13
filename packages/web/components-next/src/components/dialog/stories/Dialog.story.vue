<script setup lang="ts">
import Button from '@/components/button/default-button/Button.vue'
import { useDialog } from '@/components/dialog/dialog.composable'

import ExampleDialog from './ExampleDialog.vue'

const dialog = useDialog(ExampleDialog)
</script>

<template>
  <Story title="Dialog/Basic">
    <Button
      v-bind="dialog.triggerProps.value"
      @click="dialog.open"
    >
      Open dialog
    </Button>
  </Story>
</template>
