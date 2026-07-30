<script setup lang="ts">
import {
  DrawerContent as RekaDrawerContent,
  DrawerHandle as RekaDrawerHandle,
  DrawerOverlay as RekaDrawerOverlay,
  DrawerPortal as RekaDrawerPortal,
  DrawerRoot as RekaDrawerRoot,
  DrawerTitle as RekaDrawerTitle,
  DrawerTrigger as RekaDrawerTrigger,
} from 'reka-ui'
import {
  ref,
  watch,
} from 'vue'

import { useOverlayStack } from '@/composables/overlayStack.composable'
import type { ResponsiveDrawerProps } from '@/ui/responsive-drawer/responsiveDrawer.props'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = defineProps<ResponsiveDrawerProps>()

const emit = defineEmits<{
  autoFocusOnClose: [event: Event]
  escapeKeyDown: [event: KeyboardEvent]
  focusOutside: [event: CustomEvent]
  interactOutside: [event: CustomEvent]
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

const overlayStack = useOverlayStack()

const drawerZIndex = ref<number>(0)

watch(isOpen, (isOpenValue) => {
  if (isOpenValue) {
    drawerZIndex.value = overlayStack.registerOverlay()
  }
}, {
  immediate: true,
})

function onEscapeKeyDown(event: KeyboardEvent): void {
  emit('escapeKeyDown', event)
}

function onFocusOutside(event: CustomEvent): void {
  emit('focusOutside', event)
}

function onInteractOutside(event: CustomEvent): void {
  emit('interactOutside', event)
}

function onAutoFocusOnClose(event: Event): void {
  emit('autoFocusOnClose', event)
}

// onMounted(() => {
//   useEventListener('focusin', (event) => {
//     if (event.target instanceof HTMLInputElement) {
//       event.preventDefault()
//       event.stopPropagation()
//       event.stopImmediatePropagation()
//     }
//   })
// })
</script>

<template>
  <RekaDrawerRoot v-model:open="isOpen">
    <RekaDrawerTrigger
      :as-child="true"
      v-on="$attrs"
    >
      <slot name="trigger" />
    </RekaDrawerTrigger>

    <RekaDrawerPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaDrawerOverlay
          :style="{ zIndex: drawerZIndex }"
          class="
            fixed inset-0 bg-linear-to-t from-black/50 to-black/25
            dark:from-black/80 dark:to-black/50
          "
          data-animation="drawer-overlay"
        />
      </ThemeProvider>

      <ThemeProvider :as-child="true">
        <RekaDrawerContent
          :style="{
            zIndex: drawerZIndex,
          }"
          class="
            fixed inset-x-0 bottom-0 flex max-h-[95dvh] flex-col
            will-change-transform outline-none
          "
          data-animation="drawer-content"
          @close-auto-focus="onAutoFocusOnClose"
          @escape-key-down="onEscapeKeyDown"
          @focus-outside="onFocusOutside"
          @interact-outside="onInteractOutside"
        >
          <div
            class="
              relative flex max-h-full flex-col overflow-hidden rounded-t-lg
              border-x border-t border-secondary bg-primary
              pb-[env(safe-area-inset-bottom)] shadow-lg
            "
          >
            <RekaDrawerHandle class="flex w-full shrink-0 justify-center py-md">
              <span class="h-1.5 w-10 rounded-full bg-quaternary" />
            </RekaDrawerHandle>

            <RekaDrawerTitle class="sr-only">
              {{ props.title }}
            </RekaDrawerTitle>

            <!--
              Scopes swipe-to-dismiss to the handle — reka's pointer capture
              otherwise steals clicks from non-button content (e.g. options).
            -->
            <div
              class="contents"
              @pointerdown.stop
              @touchstart.stop
            >
              <slot name="content" />
            </div>
          </div>
        </RekaDrawerContent>
      </ThemeProvider>
    </RekaDrawerPortal>
  </RekaDrawerRoot>
</template>
