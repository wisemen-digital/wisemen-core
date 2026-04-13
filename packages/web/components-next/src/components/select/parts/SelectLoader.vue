<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectSelectContext } from '@/components/select/select.context'
import Spinner from '@/components/spinner/Spinner.vue'

const {
  isLoading,
  classConfig,
  customClassConfig,
  style,
} = useInjectSelectContext()

const {
  t,
} = useI18n()
</script>

<template>
  <Transition
    enter-from-class="opacity-0 scale-75 blur-xxs"
    leave-to-class="opacity-0 scale-75 blur-xxs"
    enter-active-class="duration-300 absolute right-0"
    leave-active-class="duration-300 absolute right-0"
  >
    <div
      v-if="isLoading"
      :class="style.loader({
        class: mergeClasses(customClassConfig.loader, classConfig?.loader),
      })"
    >
      <span class="sr-only">
        {{ t('shared.loading') }}
      </span>

      <slot>
        <Spinner :aria-hidden="true" />
      </slot>
    </div>
  </Transition>
</template>
