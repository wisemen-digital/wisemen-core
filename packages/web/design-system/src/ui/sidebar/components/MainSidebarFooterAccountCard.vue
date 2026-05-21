<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { ChevronDownIcon } from '@wisemen/vue-core-icons'

import ActionDropdownMenu from '@/ui/action-dropdown-menu/ActionDropdownMenu.vue'
import Avatar from '@/ui/avatar/avatar/Avatar.vue'
import { UICard } from '@/ui/card/index'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { UIRowLayout } from '@/ui/row-layout/index'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import { UIText } from '@/ui/text/index'

const props = defineProps<{
  name: string | null
  actions: Action[]
  avatarUrl?: string
  email: string
}>()

const {
  isSidebarOpen,
  collapsedVariant,
  sidebarIconCellSize,
} = useMainSidebar()

const accountCardGridTemplateColumns = `${sidebarIconCellSize} 1fr`
</script>

<template>
  <ActionDropdownMenu
    :actions="props.actions"
    :current-context-only="false"
    popover-side="right"
    popover-align="end"
  >
    <ClickableElement>
      <button
        class="flex h-12 items-center justify-center"
        type="button"
      >
        <UICard
          :class="collapsedVariant === 'minified' && !isSidebarOpen
            ? 'border-transparent'
            : `
              bg-primary-alt p-md py-sm pl-xs
              hover:bg-tertiary/50
            `
          "
          :style="{
            gridTemplateColumns: accountCardGridTemplateColumns,
          }"
          class="grid w-full gap-xs overflow-hidden text-left duration-100"
        >
          <UIRowLayout
            align="center"
            justify="center"
            class="h-full"
          >
            <Avatar
              :name="props.name ?? props.email"
              :src="props.avatarUrl"
              :is-static-color="true"
              size="xs"
            />
          </UIRowLayout>

          <MainSidebarFadeTransition>
            <UIRowLayout
              v-if="collapsedVariant !== 'minified' || isSidebarOpen"
              justify="between"
              align="center"
              gap="xxs"
              class="overflow-hidden"
            >
              <div class="flex w-full flex-col overflow-hidden">
                <UIText
                  :text="props.name ?? '-'"
                  :disable-tooltip="true"
                  class="w-full text-xs font-semibold text-primary"
                />
                <UIText
                  :text="props.email"
                  :disable-tooltip="true"
                  class="w-full text-xs text-tertiary"
                />
              </div>
              <ColumnLayout
                align="start"
                class="h-full"
              >
                <ChevronDownIcon
                  class="mt-xxs size-4 shrink-0 text-quaternary"
                />
              </ColumnLayout>
            </UIRowLayout>
          </MainSidebarFadeTransition>
        </UICard>
      </button>
    </ClickableElement>
  </ActionDropdownMenu>
</template>
