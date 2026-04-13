<script setup lang="ts">
import { VcIconButton } from '@wisemen/vue-core-components'
import { useI18n } from 'vue-i18n'

import { useInjectSettingsContext } from '@/modules/settings/settings.context'

const {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
} = useInjectSettingsContext()

const {
  t,
} = useI18n()
</script>

<template>
  <div class="-ml-lg flex">
    <VcIconButton
      :is-disabled="!canGoBack"
      :class-config="{
        root: 'w-7 rounded-md',
      }"
      :label="t('module.settings.back.label')"
      icon="chevronLeft"
      variant="tertiary"
      size="sm"
      @click="goBack"
    />

    <VcIconButton
      :is-disabled="!canGoForward"
      :class-config="{
        root: 'w-7 rounded-md',
      }"
      :label="t('module.settings.forward.label')"
      icon="chevronRight"
      variant="tertiary"
      size="sm"
      @click="goForward"
    />
  </div>
</template>
