<script setup lang="ts">
import {
  ContextMenuContent as RekaContextMenuContent,
  ContextMenuPortal as RekaContextMenuPortal,
  ContextMenuRoot as RekaContextMenuRoot,
  ContextMenuTrigger as RekaContextMenuTrigger,
} from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import { useAdaptiveContentWidth } from '@/composables/adaptiveContentWidth.composable'
import { useMenuAutoHighlight } from '@/composables/menuAutoHighlight.composable'
import type { ContextMenuProps } from '@/ui/context-menu/contextMenu.props'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<ContextMenuProps>(), {
  isPrioritizedPosition: false,
  isUpdateOnLayoutShiftDisabled: false,
  collisionPadding: 0,
})

const emit = defineEmits<{
  open: []
}>()
const isPrioritizedPosition = computed<boolean>(
  () => props.isPrioritizedPosition || props.prioritizePosition === true,
)
const isUpdateOnLayoutShiftDisabled = computed<boolean>(
  () => props.isUpdateOnLayoutShiftDisabled || props.disableUpdateOnLayoutShift === true,
)

const isOpen = ref(false)

function onUpdateIsOpen(open: boolean): void {
  isOpen.value = open

  if (open) {
    emit('open')
  }
}

const adaptiveContentWidth = useAdaptiveContentWidth(
  () => props.isAdaptiveContentWidth === true,
  () => isOpen.value,
)

const menuAutoHighlight = useMenuAutoHighlight()
</script>

<template>
  <RekaContextMenuRoot @update:open="onUpdateIsOpen">
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
          :disable-update-on-layout-shift="isUpdateOnLayoutShiftDisabled"
          :prioritize-position="isPrioritizedPosition"
          :style="adaptiveContentWidth.style.value"
          data-animation="popover-default"
          class="
            z-50 min-w-48 origin-(--reka-context-menu-content-transform-origin)
            will-change-[transform,opacity]
          "
          @close-auto-focus="menuAutoHighlight.onCloseAutoFocus"
          @open-auto-focus="menuAutoHighlight.onOpenAutoFocus"
        >
          <div
            :ref="adaptiveContentWidth.contentRef"
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
