<script setup lang="ts">
import { Toggle } from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { useInjectDetailPaneContext } from '@/ui/page/detailPane.context'

const {
  isOpen, toggleIsOpen,
} = useInjectDetailPaneContext()

const i18n = useI18n()

const label = computed<string>(() => (isOpen.value
  ? i18n.t('component.dashboard_page_detail_pane_toggle.collapse')
  : i18n.t('component.dashboard_page_detail_pane_toggle.expand')))
</script>

<template>
  <ActionTooltip
    :label="label"
    keyboard-shortcut="meta_i"
  >
    <ClickableElement @click="toggleIsOpen">
      <Toggle
        :model-value="isOpen"
        :data-state="isOpen ? 'open' : 'closed'"
        :aria-label="label"
        class="
          group/toggle -mr-xxs flex size-6 items-center justify-center
          duration-150
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
    </ClickableElement>
  </ActionTooltip>
</template>
