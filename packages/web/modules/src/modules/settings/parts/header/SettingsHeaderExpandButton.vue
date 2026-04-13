<script setup lang="ts">
import {
  useKeyboardShortcut,
  VcIconButton,
} from '@wisemen/vue-core-components'
import { useI18n } from 'vue-i18n'

import { useInjectSettingsDialogContext } from '@/modules/settings/settingsDialog.context'

const {
  isExpanded,
} = useInjectSettingsDialogContext()
const {
  t,
} = useI18n()

useKeyboardShortcut({
  keys: [
    'f',
  ],
  onTrigger: (e) => {
    e.stopImmediatePropagation()
    isExpanded.value = !isExpanded.value
  },
})
</script>

<template>
  <VcIconButton
    :icon="isExpanded ? 'shrink' : 'expand'"
    :label="isExpanded ? t('module.settings.minimize.label') : t('module.settings.maximize.label')"
    variant="tertiary"
    size="sm"
    class="
      hidden
      @3xl/settings:flex
    "
    @click="isExpanded = !isExpanded"
  />
</template>
