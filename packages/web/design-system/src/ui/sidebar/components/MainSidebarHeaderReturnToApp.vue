<script setup lang="ts">
import { ChevronLeftIcon } from '@wisemen/vue-core-icons'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

const props = defineProps<{
  to: RouteLocationRaw
}>()

const i18n = useI18n()

const {
  isSidebarOpen,
  collapsedVariant,
  sidebarIconCellSize,
  sidebarIconSize,
  sidebarLogoHeight,
} = useMainSidebar()

const gridTemplateColumns = `${sidebarIconCellSize} 1fr`
</script>

<template>
  <RowLayout
    :style="{ height: sidebarLogoHeight }"
    class="mt-px w-fit"
  >
    <ActionTooltip
      :keyboard-shortcut="{
        key: 'Backspace',
        meta: true,
      }"
      :label="i18n.t('components.sidebar.return_to_app')"
    >
      <ClickableElement>
        <RouterLink
          :to="props.to"
          :style="{
            height: sidebarIconCellSize,
            gridTemplateColumns,
          }"
          :aria-label="i18n.t('components.sidebar.return_to_app')"
          class="
            grid w-full rounded-md duration-100
            hover:bg-secondary-hover
          "
        >
          <RowLayout
            :style="{
              width: sidebarIconCellSize,
              height: sidebarIconCellSize,
            }"
            align="center"
            justify="center"
          >
            <ChevronLeftIcon
              :style="{
                width: sidebarIconSize,
                height: sidebarIconSize,
              }"
              class="shrink-0 text-fg-quaternary"
            />
          </RowLayout>
          <MainSidebarFadeTransition>
            <RowLayout
              v-if="collapsedVariant !== 'minified' || isSidebarOpen"
              align="center"
              class="overflow-hidden pr-md"
            >
              <span class="truncate text-xs font-medium text-secondary">{{ i18n.t('components.sidebar.return_to_app') }}</span>
            </RowLayout>
          </MainSidebarFadeTransition>
        </RouterLink>
      </ClickableElement>
    </ActionTooltip>
  </RowLayout>
</template>
