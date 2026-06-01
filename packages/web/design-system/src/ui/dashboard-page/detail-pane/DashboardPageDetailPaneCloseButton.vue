<script setup lang="ts">
import {
  createAction,
  useActionGroup,
} from '@wisemen/vue-core-actions'
import {
  LayoutRightIcon,
  XCloseIcon,
} from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'

import ActionTrigger from '@/ui/action-trigger/ActionTrigger.vue'
import { UIIconButton } from '@/ui/button/index'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'

const i18n = useI18n()

const {
  toggle,
} = useInjectMainContentDetailPaneContext()

const actionGroup = useActionGroup()

const toggleDetailPaneAction = createAction({
  id: 'toggle-detail-pane',
  name: () => i18n.t('action.global.toggle_detail_pane.name'),
  execute: () => {
    toggle()
  },
  group: actionGroup.navigation,
  icon: () => LayoutRightIcon,
  keyboardShortcut: {
    key: 'I',
    meta: true,
  },
  keywords: i18n.t('action.global.toggle_detail_pane.keywords').split(' '),
})
</script>

<template>
  <ActionTrigger
    :action="toggleDetailPaneAction"
    :current-context-only="true"
  >
    <template #default="{ label }">
      <UIIconButton
        :label="label"
        :icon="XCloseIcon"
        variant="tertiary"
      />
    </template>
  </ActionTrigger>
</template>
