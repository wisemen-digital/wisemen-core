<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectIconButtonContext } from '@/components/button/icon-button/iconButton.context'
import Spinner from '@/components/spinner/Spinner.vue'

const {
  isLoading,
  classConfig,
  customClassConfig,
  style,
} = useInjectIconButtonContext()

const {
  t,
} = useI18n()
</script>

<template>
  <Transition
    enter-from-class="opacity-0 scale-75 blur-xxs"
    leave-to-class="opacity-0 scale-75 blur-xxs"
    enter-active-class="absolute duration-300"
    leave-active-class="absolute duration-300"
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
        <Spinner />
      </slot>
    </div>
  </Transition>
</template>
