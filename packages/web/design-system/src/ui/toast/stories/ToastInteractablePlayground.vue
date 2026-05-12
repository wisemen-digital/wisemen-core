<script setup lang="ts">
import { CornerDownRightIcon } from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import { useToast } from '@/ui/toast/toast.composable'

const toast = useToast()

function show(): void {
  toast.show({
    interactableModels: {
      user: {
        icon: CornerDownRightIcon,
        imageSrc: 'https://i.pravatar.cc/100',
        label: 'Alice Johnson',
        to: '/',
      },
    },
    message: 'Project assigned to {user}.',
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
