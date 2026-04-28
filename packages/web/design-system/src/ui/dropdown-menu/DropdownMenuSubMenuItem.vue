<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuSub as RekaDropdownMenuSub,
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
  DropdownMenuSubTrigger as RekaDropdownMenuSubTrigger,
} from 'reka-ui'
import { computed } from 'vue'

import DropdownMenuContentVue from '@/ui/dropdown-menu/DropdownMenuContent.vue'
import type { DropdownMenuSubMenuItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'
import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = defineProps<{
  item: DropdownMenuSubMenuItem
}>()

const config = computed<MenuItemConfig>(() => ({
  ...props.item,
  right: props.item.right ?? {
    icon: ChevronRightIcon,
    type: 'icon',
  },
}))
</script>

<template>
  <RekaDropdownMenuSub>
    <RekaDropdownMenuSubTrigger
      class="
        group/dropdown-menu-item cursor-default rounded-sm duration-100
        outline-none
        data-disabled:cursor-not-allowed
        data-highlighted:bg-secondary-hover
        data-[state=open]:bg-secondary-hover
      "
    >
      <UIMenuItem
        :config="config"
        :label="props.item.label"
      />
    </RekaDropdownMenuSubTrigger>

    <RekaDropdownMenuPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaDropdownMenuSubContent
          data-animation="dropdown-default"
          class="
            z-40 min-w-48 origin-(--reka-dropdown-menu-content-transform-origin)
            will-change-[transform,opacity]
          "
        >
          <div
            class="
              relative size-full overflow-hidden rounded-md border
              border-secondary bg-primary shadow-lg
            "
          >
            <DropdownMenuContentVue
              :items="props.item.items"
              :filter="props.item.filter"
            />
          </div>
        </RekaDropdownMenuSubContent>
      </ThemeProvider>
    </RekaDropdownMenuPortal>
  </RekaDropdownMenuSub>
</template>
