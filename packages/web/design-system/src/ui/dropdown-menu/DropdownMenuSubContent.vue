<script setup lang="ts">
import {
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
} from 'reka-ui'

import { useMenuAutoHighlight } from '@/composables/menuAutoHighlight.composable'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const menuAutoHighlight = useMenuAutoHighlight()
</script>

<template>
  <RekaDropdownMenuPortal>
    <ThemeProvider :as-child="true">
      <RekaDropdownMenuSubContent
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="5"
        class="
          z-50 max-w-64 min-w-52
          origin-(--reka-dropdown-menu-content-transform-origin)
          will-change-[transform,opacity]
        "
        @open-auto-focus="menuAutoHighlight.onOpenAutoFocus"
      >
        <div
          class="
            relative size-full
            max-h-(--reka-dropdown-menu-content-available-height)
            overflow-hidden rounded-md border border-secondary bg-primary
            shadow-lg
          "
        >
          <slot />
        </div>
      </RekaDropdownMenuSubContent>
    </ThemeProvider>
  </RekaDropdownMenuPortal>
</template>
