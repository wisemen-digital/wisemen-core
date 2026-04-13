<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import Spinner from '@/components/spinner/Spinner.vue'
import { useInjectTimeFieldContext } from '@/components/time-field/timeField.context'

const {
  isLoading,
  classConfig,
  customClassConfig,
  style,
} = useInjectTimeFieldContext()

const {
  t,
} = useI18n()
</script>

<template>
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
</template>
