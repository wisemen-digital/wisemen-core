<script setup lang="ts">
import {
  DropdownMenuContent as RekaDropdownMenuContent,
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuRoot as RekaDropdownMenuRoot,
  DropdownMenuTrigger as RekaDropdownMenuTrigger,
} from 'reka-ui'
import {
  computed,
  useTemplateRef,
  watch,
} from 'vue'

import { useAdaptiveContentWidth } from '@/composables/adaptiveContentWidth.composable'
import { POPPER_PROPS_DEFAULTS } from '@/types/popper.type'
import type { DropdownMenuProps } from '@/ui/dropdown-menu/dropdownMenu.props'
import DropdownMenuArrow from '@/ui/dropdown-menu/DropdownMenuArrow.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  ...POPPER_PROPS_DEFAULTS,
  popoverSideOffset: 4,
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const frozenAnchorRef = useTemplateRef<HTMLDivElement>('frozenAnchor')
const triggerRef = useTemplateRef<HTMLElement>('trigger')

function resolveHtmlElement(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) {
    return value
  }

  let node: Node | null = (value as { $el?: Node } | null)?.$el ?? null

  while (node !== null) {
    if (node instanceof HTMLElement) {
      return node
    }

    node = node.nextSibling
  }

  return null
}

const isContentPositionFixed = computed<boolean>(
  () => props.isContentPositionFixed || props.fixedContentPosition === true,
)
const isPrioritizedPosition = computed<boolean>(
  () => props.isPrioritizedPosition || props.prioritizePosition === true,
)
const isUpdateOnLayoutShiftDisabled = computed<boolean>(
  () => props.isUpdateOnLayoutShiftDisabled || props.disableUpdateOnLayoutShift === true,
)

watch(isOpen, (open) => {
  if (!open || !isContentPositionFixed.value || frozenAnchorRef.value === null) {
    return
  }

  const rect = resolveHtmlElement(triggerRef.value)?.getBoundingClientRect() ?? null

  if (rect === null) {
    return
  }

  frozenAnchorRef.value.style.top = `${rect.top}px`
  frozenAnchorRef.value.style.left = `${rect.left}px`
  frozenAnchorRef.value.style.height = `${rect.height}px`
  frozenAnchorRef.value.style.width = `${rect.width}px`
})

const anchorReference = computed<HTMLElement | undefined>(() => {
  if (isContentPositionFixed.value) {
    return frozenAnchorRef.value ?? undefined
  }

  return props.popoverAnchorReferenceElement as HTMLElement | undefined ?? undefined
})

const adaptiveContentWidth = useAdaptiveContentWidth(
  () => props.isAdaptiveContentWidth === true,
  () => isOpen.value,
)
</script>

<template>
  <div
    v-if="isContentPositionFixed"
    ref="frozenAnchor"
    class="pointer-events-none fixed"
  />

  <RekaDropdownMenuRoot
    v-bind="$attrs"
    v-model:open="isOpen"
  >
    <RekaDropdownMenuTrigger
      ref="trigger"
      :as-child="true"
    >
      <slot name="trigger" />
    </RekaDropdownMenuTrigger>

    <RekaDropdownMenuPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaDropdownMenuContent
          :reference="anchorReference"
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
          :disable-update-on-layout-shift="isUpdateOnLayoutShiftDisabled"
          :prioritize-position="isPrioritizedPosition"
          :data-animation="props.popoverAnimationName ?? 'popover-default'"
          :style="adaptiveContentWidth.style.value"
          position-strategy="absolute"
          sticky="always"
          class="
            z-50 min-w-48 origin-(--reka-dropdown-menu-content-transform-origin)
            will-change-[transform,opacity]
          "
        >
          <div
            :ref="adaptiveContentWidth.contentRef"
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
