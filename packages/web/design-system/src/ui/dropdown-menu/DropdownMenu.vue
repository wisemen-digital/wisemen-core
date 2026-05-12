<script setup lang="ts">
import {
  DropdownMenuContent as RekaDropdownMenuContent,
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuRoot as RekaDropdownMenuRoot,
  DropdownMenuTrigger as RekaDropdownMenuTrigger,
} from 'reka-ui'

import { POPPER_PROPS_DEFAULTS } from '@/types/popper.type'
import type { DropdownMenuProps } from '@/ui/dropdown-menu/dropdownMenu.props'
import DropdownMenuArrow from '@/ui/dropdown-menu/DropdownMenuArrow.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  ...POPPER_PROPS_DEFAULTS,
  popoverSideOffset: 4,
})
</script>

<template>
  <RekaDropdownMenuRoot>
    <RekaDropdownMenuTrigger :as-child="true">
      <slot name="trigger" />
    </RekaDropdownMenuTrigger>

    <RekaDropdownMenuPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaDropdownMenuContent
          :align="props.popoverAlign"
          :align-offset="props.popoverAlignOffset"
          :collision-padding="props.popoverCollisionPadding"
          :collision-boundary="props.popoverContainerElement"
          :side="props.popoverSide"
          :side-offset="props.popoverSideOffset"
          :class="{
            'w-(--reka-dropdown-menu-trigger-width)': props.popoverWidth === 'anchor-width',
            'w-(--reka-dropdown-menu-content-available-width)': props.popoverWidth === 'available-width',
          }"
          :disable-update-on-layout-shift="props.disableUpdateOnLayoutShift"
          :prioritize-position="props.prioritizePosition"
          :data-animation="props.popoverAnimationName ?? 'popover-default'"
          position-strategy="absolute"
          sticky="always"
          class="
            z-40 min-w-48 origin-(--reka-dropdown-menu-content-transform-origin)
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
            <slot name="content" />
          </div>

          <DropdownMenuArrow v-if="props.isPopoverArrowVisible" />
        </RekaDropdownMenuContent>
      </ThemeProvider>
    </RekaDropdownMenuPortal>
  </RekaDropdownMenuRoot>
</template>
