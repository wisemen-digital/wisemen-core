<script setup lang="ts">
import {
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuSubContent as RekaDropdownMenuSubContent,
} from 'reka-ui'

import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
</script>

<template>
  <RekaDropdownMenuPortal>
    <ThemeProvider :as-child="true">
      <RekaDropdownMenuSubContent
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="5"
        data-animation="popover-default"
        class="
          z-40 max-w-64 min-w-52
          origin-(--reka-dropdown-menu-content-transform-origin)
          will-change-[transform,opacity]
        "
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
