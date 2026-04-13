<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import TabsBase from '@/components/tabs/shared/parts/TabsBase.vue'
import TabsIndicator from '@/components/tabs/shared/parts/TabsIndicator.vue'
import TabsList from '@/components/tabs/shared/parts/TabsList.vue'
import TabsRoot from '@/components/tabs/shared/parts/TabsRoot.vue'
import TabsScrollContainer from '@/components/tabs/shared/parts/TabsScrollContainer.vue'
import TabsScrollToLeftButton from '@/components/tabs/shared/parts/TabsScrollToLeftButton.vue'
import TabsScrollToRightButton from '@/components/tabs/shared/parts/TabsScrollToRightButton.vue'
import type { TabsProps } from '@/components/tabs/shared/tabs.props'

const props = withDefaults(defineProps<TabsProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  classConfig: null,
  direction: 'horizontal',
  variant: 'underline',
})

defineSlots<{
  /**
   * Slot for the tabs items.
   */
  items: () => void
}>()

const route = useRoute()
const activeRouteName = computed<string>(() => route.name as string)
</script>

<template>
  <TabsRoot
    v-bind="props"
    :model-value="activeRouteName"
  >
    <TabsBase>
      <TabsScrollToLeftButton />

      <TabsScrollContainer>
        <TabsList>
          <slot name="items" />

          <TabsIndicator />
        </TabsList>
      </TabsScrollContainer>

      <TabsScrollToRightButton />
    </TabsBase>
  </TabsRoot>
</template>
