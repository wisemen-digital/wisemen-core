<script setup lang="ts">
import { UIIconButton } from '@wisemen/vue-core-design-system'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { useInjectPreferencesContext } from '#context/preferences.context'

const {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
} = useInjectPreferencesContext()

const {
  t,
} = useI18n()
</script>

<template>
  <div class="-ml-lg flex">
    <UIIconButton
      :is-disabled="!canGoBack"
      :label="t('module.preferences.back.label')"
      :icon="ChevronLeftIcon"
      variant="tertiary"
      size="sm"
      @click="goBack"
    />

    <UIIconButton
      :is-disabled="!canGoForward"
      :label="t('module.preferences.forward.label')"
      :icon="ChevronRightIcon"
      variant="tertiary"
      size="sm"
      @click="goForward"
    />
  </div>
</template>
