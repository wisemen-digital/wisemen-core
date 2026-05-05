<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { InfoCircleIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import ToastContainer from '@/ui/toast/ToastContainer.vue'
import { useToast } from '@/ui/toast/toast.composable'

const toast = useToast()

function show(): void {
  toast.show({
    duration: 2000,
    icon: InfoCircleIcon,
    message: 'This toast closes after 2 seconds.',
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
