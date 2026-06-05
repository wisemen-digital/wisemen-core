<script setup lang="ts">
import { useActionRegistryStore } from '@wisemen/vue-core-actions'

import { useCommandMenuAction } from '@/actions/commandMenu.action'
import {
  UIApplicationLoadingView,
  UIApplicationOfflineWarning,
  UIApplicationSkipToMainContent,
} from '@/ui/application'
import { UIDialogContainer } from '@/ui/dialog'
import { UIToastContainer } from '@/ui/toast'
import TooltipProvider from '@/ui/tooltip/TooltipProvider.vue'

const props = defineProps<{
  isFetchingAuthUser: boolean
}>()

const actionRegistryStore = useActionRegistryStore()

actionRegistryStore.registerActions(useCommandMenuAction())
</script>

<template>
  <TooltipProvider>
    <UIApplicationSkipToMainContent />
    <UIApplicationOfflineWarning />
    <UIApplicationLoadingView
      :is-fetching-auth-user="props.isFetchingAuthUser"
    />
    <UIToastContainer />
    <UIDialogContainer />
    <slot />
  </TooltipProvider>
</template>
