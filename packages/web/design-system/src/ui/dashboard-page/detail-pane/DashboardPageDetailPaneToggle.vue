<script setup lang="ts">
import {
  _createUntypedAction,
  GroupPriority,
  useActionGroup,
} from '@wisemen/vue-core-actions'
import {
  FlexAlignRightIcon,
  LayoutRightIcon,
} from '@wisemen/vue-core-icons'
import { Toggle } from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ActionTrigger from '@/ui/action-trigger/ActionTrigger.vue'
import { UIClickableElement } from '@/ui/clickable-element'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'

const {
  isOpen, toggle,
} = useInjectMainContentDetailPaneContext()

const i18n = useI18n()
const actionGroup = useActionGroup()
const toggleDetailPaneAction = _createUntypedAction({
  id: 'toggle-detail-pane',
  name: () => i18n.t('action.global.toggle_detail_pane.name'),
  execute: () => {
    toggle()
  },
  group: actionGroup.navigation,
  icon: () => isOpen.value
    ? LayoutRightIcon
    : FlexAlignRightIcon,
  keyboardShortcut: {
    key: 'I',
    meta: true,
  },
  keywords: i18n.t('action.global.toggle_detail_pane.keywords').split(' '),
})

const label = computed<string>(() => (isOpen.value
  ? i18n.t('component.dashboard_page_detail_pane_toggle.collapse')
  : i18n.t('component.dashboard_page_detail_pane_toggle.expand')))
</script>

<template>
  <ActionTooltip
    :label="label"
    :keyboard-shortcut="toggleDetailPaneAction.keyboardShortcut"
  >
    <ActionTrigger
      :current-context-only="false"
      :action="toggleDetailPaneAction"
      :group-priority="GroupPriority.NAVIGATION"
    >
      <UIClickableElement>
        <Toggle
          :model-value="isOpen"
          :data-state="isOpen ? 'open' : 'closed'"
          :aria-label="label"
          class="
            group/toggle -mr-xxs flex size-6 items-center justify-center
            rounded-sm duration-150
            hover:bg-secondary-hover
          "
        >
          <div
            class="
              flex h-3 w-3.5 justify-end rounded-[0.1875rem] border
              border-fg-tertiary p-[0.09375rem] duration-150
              group-data-[state=open]/toggle:border-fg-tertiary
              dark:group-data-[state=open]/toggle:border-fg-secondary
            "
          >
            <div
              class="
                h-full w-0.5 rounded-[1px] bg-fg-tertiary duration-150
                group-data-[state=open]/toggle:w-1
                group-data-[state=open]/toggle:bg-fg-tertiary
                dark:group-data-[state=open]/toggle:bg-fg-secondary
              "
            />
          </div>
        </Toggle>
      </UIClickableElement>
    </ActionTrigger>
  </ActionTooltip>
</template>
