<script setup lang="ts">
import { NumberFieldIncrement as RekaNumberFieldIncrement } from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { mergeClassConfigs } from '@/class-variant/customClassVariants'
import IconButton from '@/components/button/icon-button/IconButton.vue'
import { useInjectNumberFieldContext } from '@/components/number-field/numberField.context'

const {
  isDisabled,
  classConfig,
  customClassConfig,
  hideControls,
} = useInjectNumberFieldContext()

const {
  t,
} = useI18n()
</script>

<template>
  <RekaNumberFieldIncrement
    v-if="!hideControls"
    :as-child="true"
  >
    <IconButton
      :is-disabled="isDisabled"
      :label="t('component.number_field.increment')"
      :class-config="mergeClassConfigs(
        {
          icon: 'size-4',
          root: 'min-w-7 h-7 rounded-[0.3rem] mr-[0.3rem]',
        },
        customClassConfig?.increment,
        classConfig?.increment,
      )"
      icon="plus"
      variant="tertiary"
      size="sm"
    />
  </RekaNumberFieldIncrement>
</template>
