<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectRouterLinkButtonContext } from '@/components/button/router-link-button/routerLinkButton.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectRouterLinkButtonContext()
</script>

<template>
  <div
    :class="style.content({
      class: mergeClasses(customClassConfig.content, classConfig?.content),
    })"
  >
    <slot />
  </div>
</template>
