<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectBadgeContext } from '@/components/badge/badge.context'
import Icon from '@/components/icon/Icon.vue'

const {
  classConfig,
  customClassConfig,
  icon,
  style,
} = useInjectBadgeContext()
</script>

<template>
  <Icon
    v-if="icon !== null"
    :icon="icon"
    :class="style.icon({
      class: mergeClasses(customClassConfig.icon, classConfig?.icon),
    })"
  />
</template>
