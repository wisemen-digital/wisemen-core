<script setup lang="ts">
import { DropdownMenuItem as RekaDropdownMenuItem } from 'reka-ui'
import { useAttrs } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDropdownMenuContext } from '@/components/dropdown-menu/dropdownMenu.context'
import type { DropdownMenuItemProps } from '@/components/dropdown-menu/dropdownMenu.props'
import { useProvideDropdownMenuItemContext } from '@/components/dropdown-menu/dropdownMenuItem.context'
import DropdownMenuItemIcon from '@/components/dropdown-menu/parts/DropdownMenuItemIcon.vue'
import DropdownMenuItemLabel from '@/components/dropdown-menu/parts/DropdownMenuItemLabel.vue'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
  testId: null,
  isDestructive: false,
  isDisabled: false,
  icon: null,
})

const emit = defineEmits<{
  /**
   * Emitted when the item is selected.
   */
  select: [event: Event]
}>()

const attrs = useAttrs()

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectDropdownMenuContext()

useProvideDropdownMenuItemContext(toComputedRefs(props))
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement :is-disabled="props.isDisabled">
      <RekaDropdownMenuItem
        :data-destructive="props.isDestructive || undefined"
        :class="style.item({
          class: mergeClasses(customClassConfig.item, classConfig?.item, attrs.class as string),
        })"
        @select="emit('select', $event)"
      >
        <slot>
          <DropdownMenuItemIcon />
          <DropdownMenuItemLabel />

          <slot name="right" />
        </slot>
      </RekaDropdownMenuItem>
    </InteractableElement>
  </TestIdProvider>
</template>
