<script setup lang="ts">
import type { ButtonProps } from '@/components/button/default-button/button.props'
import ButtonContent from '@/components/button/default-button/parts/ButtonContent.vue'
import ButtonIconLeft from '@/components/button/default-button/parts/ButtonIconLeft.vue'
import ButtonIconRight from '@/components/button/default-button/parts/ButtonIconRight.vue'
import ButtonLoader from '@/components/button/default-button/parts/ButtonLoader.vue'
import ButtonRoot from '@/components/button/default-button/parts/ButtonRoot.vue'
import type { ButtonEmits } from '@/components/button/shared/sharedButton.props'

const props = defineProps<ButtonProps>()

const emit = defineEmits<ButtonEmits>()

defineSlots<{
  /**
   * The main content of the button.
   * Typically includes text, but can also contain other elements.
   */
  'default': () => void
  /**
   * Custom slot for the left-side icon.
   * Overrides the default icon displayed before the button content.
   */
  'icon-left': () => void
  /**
   * Custom slot for the right-side icon.
   * Overrides the default icon displayed after the button content.
   */
  'icon-right': () => void
  /**
   * Custom slot for the loading indicator.
   * Replaces the default loading spinner when the button is in a loading state.
   */
  'loader': () => void
}>()
</script>

<template>
  <ButtonRoot
    v-bind="props"
    @click="emit('click', $event)"
  >
    <slot name="loader">
      <ButtonLoader />
    </slot>

    <ButtonContent>
      <slot name="icon-left">
        <ButtonIconLeft />
      </slot>

      <slot />

      <slot name="icon-right">
        <ButtonIconRight />
      </slot>
    </ButtonContent>
  </ButtonRoot>
</template>
