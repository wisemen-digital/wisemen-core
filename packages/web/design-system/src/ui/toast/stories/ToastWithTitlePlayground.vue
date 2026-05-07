<script setup lang="ts">
import { CheckCircleIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import { useToast } from '@/ui/toast/toast.composable'
import ToastContainer from '@/ui/toast/ToastContainer.vue'

const toast = useToast()

function show(): void {
  toast.show({
    title: 'Changes saved',
    icon: CheckCircleIcon,
    message: 'Your file has been saved to the cloud.',
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
