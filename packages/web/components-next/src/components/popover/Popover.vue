<script setup lang="ts">
import PopoverAnchor from '@/components/popover/parts/PopoverAnchor.vue'
import PopoverArrow from '@/components/popover/parts/PopoverArrow.vue'
import PopoverContent from '@/components/popover/parts/PopoverContent.vue'
import PopoverContentTransition from '@/components/popover/parts/PopoverContentTransition.vue'
import PopoverPortal from '@/components/popover/parts/PopoverPortal.vue'
import PopoverRoot from '@/components/popover/parts/PopoverRoot.vue'
import PopoverTrigger from '@/components/popover/parts/PopoverTrigger.vue'
import type { PopoverProps } from '@/components/popover/popover.props'

const props = withDefaults(defineProps<PopoverProps>(), {})

const emit = defineEmits<{
  autoFocusOnClose: [event: Event]
  escapeKeyDown: [event: KeyboardEvent]
  focusOutside: [event: CustomEvent]
  interactOutside: [event: CustomEvent]
}>()

defineSlots<{
  /**
   * The content to display in the popover.
   */
  content: () => void
  /**
   * Override the default popover anchor and trigger.
   */
  default: () => void
  /**
   * The content that will trigger the popover. This should always be an interactive element.
   */
  trigger: () => void
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})
</script>

<template>
  <PopoverRoot
    v-bind="props"
    v-model:is-open="isOpen"
    @escape-key-down="emit('escapeKeyDown', $event)"
    @focus-outside="emit('focusOutside', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @auto-focus-on-close="emit('autoFocusOnClose', $event)"
  >
    <slot>
      <PopoverAnchor>
        <PopoverTrigger>
          <slot name="trigger" />
        </PopoverTrigger>
      </PopoverAnchor>
    </slot>

    <PopoverPortal>
      <PopoverContent>
        <PopoverContentTransition>
          <slot name="content" />

          <PopoverArrow />
        </PopoverContentTransition>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
