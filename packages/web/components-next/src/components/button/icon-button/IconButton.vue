<script setup lang="ts">
import type { IconButtonProps } from '@/components/button/icon-button/iconButton.props'
import IconButtonIcon from '@/components/button/icon-button/parts/IconButtonIcon.vue'
import IconButtonLoader from '@/components/button/icon-button/parts/IconButtonLoader.vue'
import IconButtonRoot from '@/components/button/icon-button/parts/IconButtonRoot.vue'
import type { ButtonEmits } from '@/components/button/shared/sharedButton.props'

const props = defineProps<IconButtonProps>()

const emit = defineEmits<ButtonEmits>()

defineSlots<{
  /**
   * Slot to override the icon.
   */
  icon: () => void
  /**
   * Slot to override the default loading indicator.
   */
  loader: () => void
}>()
</script>

<template>
  <IconButtonRoot
    v-bind="props"
    @click="emit('click', $event)"
  >
    <slot name="icon">
      <IconButtonIcon />
    </slot>

    <slot name="loader">
      <IconButtonLoader />
    </slot>
  </IconButtonRoot>
</template>
