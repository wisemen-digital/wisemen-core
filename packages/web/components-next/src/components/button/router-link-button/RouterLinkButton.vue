<script setup lang="ts">
import RouterLinkButtonContent from '@/components/button/router-link-button/parts/RouterLinkButtonContent.vue'
import RouterLinkButtonIconLeft from '@/components/button/router-link-button/parts/RouterLinkButtonIconLeft.vue'
import RouterLinkButtonIconRight from '@/components/button/router-link-button/parts/RouterLinkButtonIconRight.vue'
import RouterLinkButtonRoot from '@/components/button/router-link-button/parts/RouterLinkButtonRoot.vue'
import type { RouterLinkButtonProps } from '@/components/button/router-link-button/routerLinkButton.props'

const props = defineProps<RouterLinkButtonProps>()

defineSlots<{
  /**
   * Slot to override the main content of the button.
   */
  'default': () => void
  /**
   * Slot to override the default left-side icon of the button.
   */
  'icon-left': () => void
  /**
   * Slot to override the default right-side icon of the button.
   */
  'icon-right': () => void
  /**
   * Slot to override the default loading indicator.
   */
  'loader': () => void
}>()
</script>

<template>
  <RouterLinkButtonRoot v-bind="props">
    <RouterLinkButtonContent>
      <slot name="icon-left">
        <RouterLinkButtonIconLeft />
      </slot>

      <slot />

      <slot name="icon-right">
        <RouterLinkButtonIconRight />
      </slot>
    </RouterLinkButtonContent>
  </RouterLinkButtonRoot>
</template>
