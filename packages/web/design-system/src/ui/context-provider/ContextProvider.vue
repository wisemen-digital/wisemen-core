<script setup lang="ts">
import { useActionRegistryStore } from '@wisemen/vue-core-actions'

import { useCommandMenuAction } from '@/actions/commandMenu.action'
import { UIApplicationSkipToMainContent } from '@/ui/application'
import { UIDialogContainer } from '@/ui/dialog'
import { UIToastContainer } from '@/ui/toast'
import TooltipProvider from '@/ui/tooltip/TooltipProvider.vue'

const actionRegistryStore = useActionRegistryStore()

actionRegistryStore.registerActions(useCommandMenuAction())
</script>

<template>
  <TooltipProvider>
    <UIApplicationSkipToMainContent />
    <UIToastContainer />
    <UIDialogContainer />
    <slot />
  </TooltipProvider>
</template>
