<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import Icon from '@/components/icon/Icon.vue'
import { useInjectSelectContext } from '@/components/select/select.context'

const {
  isLoading,
  classConfig,
  customClassConfig,
  iconRight,
  style,
} = useInjectSelectContext()
</script>

<template>
  <Transition
    enter-from-class="opacity-0 scale-75 blur-xxs"
    leave-to-class="opacity-0 scale-75 blur-xxs"
    enter-active-class="duration-300"
    leave-active-class="duration-300"
  >
    <Icon
      v-if="iconRight !== null && !isLoading"
      :icon="iconRight"
      :class="style.iconRight({
        class: mergeClasses(customClassConfig.iconRight, classConfig?.iconRight),
      })"
    />
  </Transition>
</template>
