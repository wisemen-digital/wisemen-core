<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectButtonContext } from '@/components/button/default-button/button.context'
import Spinner from '@/components/spinner/Spinner.vue'

const {
  t,
} = useI18n()

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectButtonContext()
</script>

<template>
  <div
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
</template>
