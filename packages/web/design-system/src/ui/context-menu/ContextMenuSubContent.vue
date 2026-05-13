<script setup lang="ts">
import {
  ContextMenuPortal as RekaContextMenuPortal,
  ContextMenuSubContent as RekaContextMenuSubContent,
} from 'reka-ui'

import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
</script>

<template>
  <RekaContextMenuPortal>
    <ThemeProvider :as-child="true">
      <RekaContextMenuSubContent
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="5"
        data-animation="popover-default"
        class="
          z-40 max-w-64 min-w-52
          origin-(--reka-context-menu-content-transform-origin)
          will-change-[transform,opacity]
        "
      >
        <div
          class="
            relative size-full
            max-h-(--reka-context-menu-content-available-height) overflow-hidden
            rounded-md border border-secondary bg-primary shadow-lg
          "
        >
          <slot />
        </div>
      </RekaContextMenuSubContent>
    </ThemeProvider>
  </RekaContextMenuPortal>
</template>
