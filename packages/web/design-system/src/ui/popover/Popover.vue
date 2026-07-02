<script setup lang="ts">
import {
  PopoverAnchor as RekaPopoverAnchor,
  PopoverContent as RekaPopoverContent,
  PopoverPortal as RekaPopoverPortal,
  PopoverRoot as RekaPopoverRoot,
  PopoverTrigger as RekaPopoverTrigger,
} from 'reka-ui'
import { computed } from 'vue'

import { POPPER_PROPS_DEFAULTS } from '@/types/popper.type'
import type { PopoverProps } from '@/ui/popover/popover.props'
import PopoverArrow from '@/ui/popover/PopoverArrow.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = withDefaults(defineProps<PopoverProps>(), {
  ...POPPER_PROPS_DEFAULTS,
  isPrioritizedPosition: false,
  isSideFlipDisabled: false,
  isUpdateOnLayoutShiftDisabled: false,
})

const isPrioritizedPosition = computed(() => props.isPrioritizedPosition || props.prioritizePosition)
const isSideFlipDisabled = computed(() => props.isSideFlipDisabled || props.disableSideFlip)
const isUpdateOnLayoutShiftDisabled = computed(() => props.isUpdateOnLayoutShiftDisabled || props.disableUpdateOnLayoutShift)

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
</script>

<template>
  <RekaPopoverRoot v-model:open="isOpen">
    <RekaPopoverAnchor
      :as-child="true"
      :reference="props.popoverAnchorReferenceElement ?? undefined"
    >
      <RekaPopoverTrigger
        :as-child="true"
        v-on="$attrs"
      >
        <slot name="trigger" />
      </RekaPopoverTrigger>
    </RekaPopoverAnchor>

    <RekaPopoverPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaPopoverContent
          :align="props.popoverAlign"
          :align-offset="props.popoverAlignOffset"
          :collision-padding="props.popoverCollisionPadding"
          :collision-boundary="props.popoverContainerElement"
          :side="props.popoverSide"
          :side-offset="props.popoverSideOffset"
          :class="{
            'w-(--reka-popover-trigger-width)': props.popoverWidth === 'anchor-width',
            'w-(--reka-popover-content-available-width)': props.popoverWidth === 'available-width',
          }"
          :prioritize-position="isPrioritizedPosition"
          :data-animation="props.popoverAnimationName ?? 'popover-default'"
          :disable-update-on-layout-shift="isUpdateOnLayoutShiftDisabled"
          :side-flip="!isSideFlipDisabled"
          position-strategy="absolute"
          sticky="always"
          class="
            z-50 origin-(--reka-popover-content-transform-origin)
            will-change-[transform,opacity]
          "
          @close-auto-focus="onAutoFocusOnClose"
          @escape-key-down="onEscapeKeyDown"
          @focus-outside="onFocusOutside"
          @interact-outside="onInteractOutside"
        >
          <div
            class="
              relative size-full overflow-hidden rounded-md border
              border-secondary bg-primary shadow-lg
            "
          >
            <slot name="content" />
          </div>

          <PopoverArrow v-if="props.isPopoverArrowVisible" />
        </RekaPopoverContent>
      </ThemeProvider>
    </RekaPopoverPortal>
  </RekaPopoverRoot>
</template>
