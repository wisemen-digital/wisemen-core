<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button/index'
import { UIRowLayout } from '@/ui/row-layout/index'
import ToastContainer from '@/ui/toast/ToastContainer.vue'
import { useToast } from '@/ui/toast/toast.composable'
import type { ToastVariant } from '@/ui/toast/toast.type'

const toast = useToast()

const variants: { icon: object, label: string, variant: ToastVariant }[] = [
  { icon: CheckCircleIcon, label: 'Info', variant: 'info' },
  { icon: AlertCircleIcon, label: 'Error', variant: 'error' },
  { icon: AlertTriangleIcon, label: 'Warning', variant: 'warning' },
]

function show(variant: ToastVariant, icon: object): void {
  toast.show({
    icon,
    message: 'Your changes have been saved successfully.',
    title: 'Changes saved',
    variant,
  })
}
</script>

<template>
  <ToastContainer />

  <UIRowLayout>
    <UIButton
      v-for="{ icon, label, variant } in variants"
      :key="variant"
      :label="label"
      variant="secondary"
      @click="show(variant, icon)"
    />
  </UIRowLayout>
</template>
