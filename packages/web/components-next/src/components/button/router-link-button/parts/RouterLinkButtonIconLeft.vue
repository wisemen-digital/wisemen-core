<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectRouterLinkButtonContext } from '@/components/button/router-link-button/routerLinkButton.context'
import Icon from '@/components/icon/Icon.vue'

const {
  classConfig,
  customClassConfig,
  iconLeft,
  style,
} = useInjectRouterLinkButtonContext()
</script>

<template>
  <Icon
    v-if="iconLeft !== null"
    :icon="iconLeft"
    :class="style.iconLeft({
      class: mergeClasses(customClassConfig.iconLeft, classConfig?.iconLeft),
    })"
  />
</template>
