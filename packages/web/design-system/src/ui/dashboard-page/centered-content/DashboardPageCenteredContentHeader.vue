<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { useSlots } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionDropdownMenu from '@/ui/action-dropdown-menu/ActionDropdownMenu.vue'
import { UIBaseHeader } from '@/ui/base-header'
import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'
import { UIIconButton } from '@/ui/button'
import DashboardPageCenteredContentHeaderScrollGradient from '@/ui/dashboard-page/centered-content/DashboardPageCenteredContentHeaderScrollGradient.vue'

const props = withDefaults(defineProps<{
  title: string
  actions?: Action[]
  headerLeftConfig?: BaseHeaderLeftConfig | null
}>(), {
  actions: () => [],
  headerLeftConfig: null,
})

const i18n = useI18n()

const slots = useSlots()
</script>

<template>
  <header class="sticky top-0 z-1 py-4xl">
    <DashboardPageCenteredContentHeaderScrollGradient />
    <UIBaseHeader
      :title="props.title"
      :left="props.headerLeftConfig"
      class="relative"
    >
      <template
        v-if="slots['title-end']"
        #title-end
      >
        <slot name="title-end" />
      </template>
      <template
        v-if="slots.subtitle !== undefined"
        #subtitle
      >
        <slot name="subtitle" />
      </template>

      <template #actions>
        <slot name="actions" />

        <ActionDropdownMenu
          v-if="props.actions.length > 0"
          :actions="props.actions"
          :current-context-only="false"
          popover-side="bottom"
          popover-align="end"
        >
          <UIIconButton
            :label="i18n.t('component.dashboard_page_header.options')"
            :icon="DotsVerticalIcon"
            :is-tooltip-disabled="true"
            variant="tertiary"
          />
        </ActionDropdownMenu>
      </template>
    </UIBaseHeader>
  </header>
</template>
