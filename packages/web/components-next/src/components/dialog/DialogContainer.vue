<script setup lang="ts">
import { useDialogContainer } from '@/components/dialog/dialog.composable'

const {
  dialogs,
} = useDialogContainer()
</script>

<template>
  <Component
    :is="dialog.component"
    v-for="dialog of dialogs"
    :key="dialog.id"
    :is-open="dialog.isOpen"
  />
</template>
