<script setup lang="ts">
import {
  ContextMenuContent as RekaContextMenuContent,
  ContextMenuPortal as RekaContextMenuPortal,
  ContextMenuRoot as RekaContextMenuRoot,
  ContextMenuTrigger as RekaContextMenuTrigger,
} from 'reka-ui'

import type { ContextMenuProps } from '@/ui/context-menu/contextMenu.props'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  collisionPadding: 0,
  disableUpdateOnLayoutShift: false,
  prioritizePosition: false,
})
</script>

<template>
  <RekaContextMenuRoot>
    <RekaContextMenuTrigger
      :as-child="true"
      data-context-menu-trigger
    >
      <slot name="trigger" />
    </RekaContextMenuTrigger>

    <RekaContextMenuPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaContextMenuContent
          :collision-padding="props.collisionPadding"
          :disable-update-on-layout-shift="props.disableUpdateOnLayoutShift"
          :prioritize-position="props.prioritizePosition"
          data-animation="popover-default"
          class="
            z-40 min-w-48 origin-(--reka-context-menu-content-transform-origin)
            will-change-[transform,opacity]
          "
        >
          <div
            class="
              relative size-full
              max-h-(--reka-context-menu-content-available-height)
              overflow-hidden rounded-md border border-secondary bg-primary
              shadow-lg
            "
          >
            <slot name="content" />
          </div>
        </RekaContextMenuContent>
      </ThemeProvider>
    </RekaContextMenuPortal>
  </RekaContextMenuRoot>
</template>

<style>
body:has([role='menu'][data-state='open']) [data-context-menu-trigger] {
  pointer-events: none !important;
}
</style>
