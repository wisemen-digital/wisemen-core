<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { InfoCircleIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import ToastContainer from '@/ui/toast/ToastContainer.vue'
import { useToast } from '@/ui/toast/toast.composable'

const toast = useToast()

function show(): void {
  toast.show({
    dismissible: false,
    icon: InfoCircleIcon,
    message: 'This toast cannot be dismissed manually.',
    variant: 'info',
  })
}
</script>

<template>
  <ToastContainer />

  <UIButton
    label="Show toast"
    variant="secondary"
    @click="show"
  />
</template>
