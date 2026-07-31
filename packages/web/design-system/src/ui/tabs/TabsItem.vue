<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsItemProps } from '@/ui/tabs/tabs.props'

import TabsItemContent from './TabsItemContent.vue'

const props = withDefaults(defineProps<TabsItemProps>(), {
  isDisabled: false,
  config: null,
  count: null,
  disabledReason: null,
  icon: undefined,
})

const tabsContext = useInjectTabsContext()
</script>

<template>
  <UIActionTooltip
    :is-disabled="props.disabledReason == null"
    :label="props.disabledReason"
  >
    <ClickableElement>
      <RekaTabsTrigger
        :value="props.value"
        :disabled="props.isDisabled"
        :class="tabsContext.variants.value.item()"
      >
        <TabsItemContent
          :config="props.config"
          :count="props.count"
          :icon="props.icon"
          :is-label-hidden="props.isLabelHidden"
          :label="props.label"
        />
      </RekaTabsTrigger>
    </ClickableElement>
  </UIActionTooltip>
</template>
