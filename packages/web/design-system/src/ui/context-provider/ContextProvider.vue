<script setup lang="ts">
import { UIDialogContainer } from '@/ui/dialog'
import { UIToastContainer } from '@/ui/toast'
import TooltipProvider from '@/ui/tooltip/TooltipProvider.vue'
</script>

<template>
  <TooltipProvider>
    <UIToastContainer />
    <UIDialogContainer />
    <slot />
  </TooltipProvider>
</template>
