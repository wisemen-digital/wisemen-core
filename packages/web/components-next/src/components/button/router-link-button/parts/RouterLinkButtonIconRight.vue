<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectRouterLinkButtonContext } from '@/components/button/router-link-button/routerLinkButton.context'
import Icon from '@/components/icon/Icon.vue'

const {
  classConfig,
  customClassConfig,
  iconRight,
  style,
} = useInjectRouterLinkButtonContext()
</script>

<template>
  <Icon
    v-if="iconRight !== null"
    :icon="iconRight"
    :class="style.iconRight({
      class: mergeClasses(customClassConfig.iconRight, classConfig?.iconRight),
    })"
  />
</template>
