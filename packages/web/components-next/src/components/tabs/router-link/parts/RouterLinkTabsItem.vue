<script setup lang="ts" generic="TMeta">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import { RouterLink } from 'vue-router'

import { mergeClasses } from '@/class-variant/customClassVariants'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useInjectTabsContext } from '@/components/tabs/shared/tabs.context'
import type { RouterLinkTabsItemProps } from '@/components/tabs/shared/tabs.props'

const props = withDefaults(defineProps<RouterLinkTabsItemProps>(), {
  id: null,
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
    <RekaTabsTrigger
      :as-child="true"
      :value="(props.to.name as string)"
      :class="style.item({
        class: mergeClasses(customClassConfig.item, classConfig?.item),
      })"
    >
      <RouterLink
        :to="props.to"
        :replace="true"
      >
        <slot />
      </RouterLink>
    </RekaTabsTrigger>
  </TestIdProvider>
</template>
