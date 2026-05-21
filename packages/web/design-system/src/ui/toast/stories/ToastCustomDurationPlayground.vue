<script setup lang="ts">
import { InfoCircleIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
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
  <UIButton
    label="Show toast"
    variant="secondary"
    @click="show"
  />
</template>
