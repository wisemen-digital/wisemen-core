<script setup lang="ts">
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button'
import { UIRowLayout } from '@/ui/row-layout'
import { useTopBarNavigationHistory } from '@/ui/top-bar/topBarNavigationHistory.composable'

const i18n = useI18n()

const {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
} = useTopBarNavigationHistory()
</script>

<template>
  <UIRowLayout gap="xxs">
    <UIIconButton
      :icon="ArrowNarrowLeftIcon"
      :is-disabled="!canGoBack"
      :label="i18n.t('component.top_bar.navigation.back')"
      :keyboard-shortcut="{
        key: 'ArrowLeft',
        meta: true,
      }"
      variant="tertiary"
      size="sm"
      @click="goBack"
    />

    <UIIconButton
      :icon="ArrowNarrowRightIcon"
      :is-disabled="!canGoForward"
      :label="i18n.t('component.top_bar.navigation.forward')"
      :keyboard-shortcut="{
        key: 'ArrowRight',
        meta: true,
      }"
      variant="tertiary"
      size="sm"
      @click="goForward"
    />
  </UIRowLayout>
</template>
