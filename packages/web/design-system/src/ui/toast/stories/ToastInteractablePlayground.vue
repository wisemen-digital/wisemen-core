<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { CheckCircleIcon, CornerDownRightIcon, User01Icon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import ToastContainer from '@/ui/toast/ToastContainer.vue'
import { useToast } from '@/ui/toast/toast.composable'

const toast = useToast()

function show(): void {
  toast.show({
    interactableModels: {
      user: {
        label: 'Alice Johnson',
        to: '/',
        icon: CornerDownRightIcon,
        imageSrc: 'https://i.pravatar.cc/100'
      },
    },
    message: 'Project assigned to {user}.',
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
