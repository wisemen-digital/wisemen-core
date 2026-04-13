<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClassConfigs } from '@/class-variant/customClassVariants'
import { useInjectBadgeContext } from '@/components/badge/badge.context'
import IconButton from '@/components/button/icon-button/IconButton.vue'

const {
  isRemovable,
  classConfig,
  customClassConfig,
  onRemove,
} = useInjectBadgeContext()

const {
  t,
} = useI18n()
</script>

<template>
  <IconButton
    v-if="isRemovable"
    :label="t('shared.remove')"
    :class-config="mergeClassConfigs(
      {
        root: 'size-4 text-inherit !bg-inherit hover:brightness-97 outline-inherit',
        icon: 'size-3.5',
      },
      customClassConfig.removeButton,
      classConfig?.removeButton,
    )"
    variant="tertiary"
    icon="close"
    @click="onRemove"
  />
</template>
