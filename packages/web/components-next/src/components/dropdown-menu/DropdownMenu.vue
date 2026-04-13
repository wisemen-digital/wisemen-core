<script setup lang="ts">
import type { DropdownMenuProps } from '@/components/dropdown-menu/dropdownMenu.props'
import DropdownMenuArrow from '@/components/dropdown-menu/parts/DropdownMenuArrow.vue'
import DropdownMenuContent from '@/components/dropdown-menu/parts/DropdownMenuContent.vue'
import DropdownMenuContentTransition from '@/components/dropdown-menu/parts/DropdownMenuContentTransition.vue'
import DropdownMenuPortal from '@/components/dropdown-menu/parts/DropdownMenuPortal.vue'
import DropdownMenuRoot from '@/components/dropdown-menu/parts/DropdownMenuRoot.vue'
import DropdownMenuTrigger from '@/components/dropdown-menu/parts/DropdownMenuTrigger.vue'

const props = defineProps<DropdownMenuProps>()

const emit = defineEmits<{
  closeAutoFocus: [event: Event]
  escapeKeyDown: [event: KeyboardEvent]
}>()

defineSlots<{
  /**
   * The content to display in the dropdown menu.
   */
  content: () => void
  /**
   * The content that will trigger the dropdown menu. This should always be an interactive element.
   */
  trigger: () => void
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})
</script>

<template>
  <DropdownMenuRoot
    v-bind="props"
    v-model:is-open="isOpen"
    @close-auto-focus="emit('closeAutoFocus', $event)"
    @escape-key-down="emit('escapeKeyDown', $event)"
  >
    <DropdownMenuTrigger>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent>
        <DropdownMenuContentTransition>
          <slot name="content" />

          <DropdownMenuArrow />
        </DropdownMenuContentTransition>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
