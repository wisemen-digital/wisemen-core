<script setup lang="ts">
import { XCloseIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import { UIIconButton } from '@/ui/button/index'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'

const i18n = useI18n()

const {
  toggle,
} = useInjectMainContentDetailPaneContext()
</script>

<template>
  <UIIconButton
    :label="i18n.t('component.dashboard_page_detail_pane_toggle.collapse')"
    :icon="XCloseIcon"
    variant="tertiary"
    @click="toggle()"
  />
</template>
