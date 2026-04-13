<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClassConfigs } from '@/class-variant/customClassVariants'
import IconButton from '@/components/button/icon-button/IconButton.vue'
import { useInjectToastContext } from '@/components/toast/toast.context'

const {
  customClassConfig, onClose,
} = useInjectToastContext()

const {
  t,
} = useI18n()
</script>

<template>
  <IconButton
    :label="t('shared.close')"
    :class-config="mergeClassConfigs(
      {
        root: 'absolute top-1.5 right-1.5',
      },
      customClassConfig?.closeButton,
    )"
    icon="close"
    variant="tertiary"
    size="sm"
    @click="onClose"
  />
</template>
