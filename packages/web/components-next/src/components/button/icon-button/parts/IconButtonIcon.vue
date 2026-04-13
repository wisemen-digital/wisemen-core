<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectIconButtonContext } from '@/components/button/icon-button/iconButton.context'
import Icon from '@/components/icon/Icon.vue'

const {
  isLoading,
  classConfig,
  customClassConfig,
  icon,
  style,
} = useInjectIconButtonContext()
</script>

<template>
  <Transition
    enter-from-class="opacity-0 scale-75 blur-xxs"
    leave-to-class="opacity-0 scale-75 blur-xxs"
    enter-active-class="duration-300"
    leave-active-class="duration-300"
  >
    <Icon
      v-if="icon !== null && !isLoading"
      :icon="icon"
      :class="style.icon({
        class: mergeClasses(customClassConfig.icon, classConfig?.icon),
      })"
    />
  </Transition>
</template>
