<script setup lang="ts" generic="TMeta">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import type { ButtonTabsItemProps } from '@/components/tabs/button/buttonTabs.props'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'

const props = withDefaults(defineProps<ButtonTabsItemProps>(), {
  testId: null,
  isDisabled: false,
})

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectTabsContext()
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement :is-disabled="props.isDisabled">
      <RekaTabsTrigger
        :value="props.value"
        :class="style.item({
          class: mergeClasses(customClassConfig.item, classConfig?.item),
        })"
      >
        <slot />
      </RekaTabsTrigger>
    </InteractableElement>
  </TestIdProvider>
</template>
