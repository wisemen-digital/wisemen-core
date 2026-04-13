<script setup lang="ts">
import Button from '@/components/button/default-button/Button.vue'
import { useDialog } from '@/components/dialog/dialog.composable'

import ExampleDrawerDialog from './ExampleDrawerDialog.vue'

const dialog = useDialog(ExampleDrawerDialog)
</script>

<template>
  <Story title="Dialog/Drawer">
    <Button
      v-bind="dialog.triggerProps.value"
      @click="dialog.open()"
    >
      Open drawer
    </Button>
  </Story>
</template>
