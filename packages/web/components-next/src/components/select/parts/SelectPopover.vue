<script setup lang="ts">
import { mergeClassConfigs } from '@/class-variant/customClassVariants'
import PopoverAnchor from '@/components/popover/parts/PopoverAnchor.vue'
import PopoverArrow from '@/components/popover/parts/PopoverArrow.vue'
import PopoverContent from '@/components/popover/parts/PopoverContent.vue'
import PopoverPortal from '@/components/popover/parts/PopoverPortal.vue'
import PopoverRoot from '@/components/popover/parts/PopoverRoot.vue'
import SelectPopoverContentTransition from '@/components/select/parts/SelectPopoverContentTransition.vue'
import SelectPopoverTrigger from '@/components/select/parts/SelectPopoverTrigger.vue'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  hasInlineSearchInput,
  isDropdownHidden,
  isDropdownVisible,
  isPopoverArrowVisible,
  classConfig,
  customClassConfig,
  popoverAlign,
  popoverAlignOffset,
  popoverAnchorReferenceElement,
  popoverCollisionPadding,
  popoverContainerElement,
  popoverSide,
  popoverSideOffset,
  popoverWidth,
  setIsDropdownVisible,
  onDropdownEscapeKeyDown,
  onDropdownInteractOutside,
} = useInjectSelectContext()

function onAutoFocusOnClose(event: Event): void {
  if (hasInlineSearchInput.value) {
    event.preventDefault()
  }
}
</script>

<template>
  <PopoverRoot
    :is-open="isDropdownVisible && !isDropdownHidden"
    :is-popover-arrow-hidden="!isPopoverArrowVisible"
    :popover-align="popoverAlign"
    :popover-align-offset="popoverAlignOffset"
    :popover-collision-padding="popoverCollisionPadding"
    :popover-container-element="popoverContainerElement"
    :popover-side-offset="popoverSideOffset"
    :popover-side="popoverSide"
    :popover-width="popoverWidth"
    :popover-anchor-reference-element="popoverAnchorReferenceElement"
    :class-config="mergeClassConfigs(
      customClassConfig.popover,
      classConfig?.popover,
    )"
    @update:is-open="setIsDropdownVisible"
    @escape-key-down="onDropdownEscapeKeyDown"
    @interact-outside="onDropdownInteractOutside"
    @auto-focus-on-close="onAutoFocusOnClose"
  >
    <slot name="anchor">
      <PopoverAnchor>
        <SelectPopoverTrigger />
      </PopoverAnchor>
    </slot>

    <slot name="inline-content" />

    <PopoverPortal>
      <PopoverContent>
        <SelectPopoverContentTransition>
          <slot name="content" />

          <PopoverArrow />
        </SelectPopoverContentTransition>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
