<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import { injectTabsRootContext } from 'reka-ui'
import { useI18n } from 'vue-i18n'

import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import {
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuItem,
} from '@/ui/dropdown-menu'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'

const i18n = useI18n()
const tabsContext = useInjectTabsContext()
const tabsRootContext = injectTabsRootContext()

function getMenuItemConfig(tabId: string): MenuItemConfig | null {
  const tab = tabsContext.overflowTabs.value.find((overflowTab) => overflowTab.id === tabId)

  if (tab == null) {
    return null
  }

  return {
    left: tab.icon == null
      ? null
      : {
          icon: tab.icon,
          type: 'icon',
        },
    right: tab.count == null
      ? null
      : {
          text: tab.count.toString(),
          type: 'text',
        },
  }
}

function onSelectTab(value: string): void {
  tabsRootContext.changeModelValue(value)
}
</script>

<template>
  <UIDropdownMenu popover-align="end">
    <template #trigger>
      <ClickableElement>
        <button
          :aria-label="i18n.t('component.tabs.overflow_menu')"
          :class="[
            tabsContext.variants.value.item(),
            tabsContext.variants.value.dropdownTrigger(),
          ]"
          data-orientation="horizontal"
          data-state="inactive"
          type="button"
        >
          <span>{{ i18n.t('component.tabs.overflow_label') }}</span>
          <ChevronDownIcon class="size-4 shrink-0" />
        </button>
      </ClickableElement>
    </template>

    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuItem
          v-for="tab in tabsContext.overflowTabs.value"
          :key="tab.id"
          :config="getMenuItemConfig(tab.id)"
          :is-disabled="tab.isDisabled"
          :disabled-reason="tab.disabledReason"
          :label="tab.label"
          @select="() => onSelectTab(tab.value)"
        />
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
