<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  useId,
  watch,
} from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsItemProps } from '@/ui/tabs/tabs.props'

import TabsItemContent from './TabsItemContent.vue'

const props = withDefaults(defineProps<TabsItemProps>(), {
  isDisabled: false,
  count: null,
  disabledReason: null,
  icon: undefined,
})

const tabsContext = useInjectTabsContext()
const tabId = useId()

type TabsRegistration = Parameters<typeof tabsContext.registerTab>[0]

const shouldRenderTrigger = computed<boolean>(() =>
  !tabsContext.isResponsiveOverflowEnabled.value || tabsContext.isTabVisible(tabId))

function getTabData(): TabsRegistration {
  return {
    id: tabId,
    isDisabled: props.isDisabled,
    isLabelHidden: props.isLabelHidden,
    count: props.count,
    disabledReason: props.disabledReason,
    icon: props.icon,
    label: props.label,
    value: props.value,
  }
}

function syncTabData(): void {
  tabsContext.updateTab(getTabData())
}

onMounted(() => {
  tabsContext.registerTab(getTabData())
})

onBeforeUnmount(() => {
  tabsContext.unregisterTab(tabId)
})

watch(() => [
  props.count,
  props.disabledReason,
  props.icon,
  props.isDisabled,
  props.isLabelHidden,
  props.label,
  props.value,
], syncTabData)
</script>

<template>
  <UIActionTooltip
    v-if="!tabsContext.isTouchDevice && shouldRenderTrigger"
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
          :count="props.count"
          :icon="props.icon"
          :is-label-hidden="props.isLabelHidden"
          :label="props.label"
        />
      </RekaTabsTrigger>
    </ClickableElement>
  </UIActionTooltip>

  <UIActionTooltip
    v-else-if="shouldRenderTrigger"
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
          :count="props.count"
          :icon="props.icon"
          :is-label-hidden="props.isLabelHidden"
          :label="props.label"
        />
      </RekaTabsTrigger>
    </ClickableElement>
  </UIActionTooltip>
</template>
