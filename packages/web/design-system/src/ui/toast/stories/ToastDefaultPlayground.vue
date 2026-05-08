<script setup lang="ts">
import { InfoCircleIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import { useToast } from '@/ui/toast/toast.composable'
import ToastContainer from '@/ui/toast/ToastContainer.vue'

const toast = useToast()

function show(): void {
  toast.show({
    icon: InfoCircleIcon,
    message: 'Your changes have been saved successfully.',
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
