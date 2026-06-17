<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  useId,
  watch,
} from 'vue'
import {
  RouterLink,
  useRouter,
} from 'vue-router'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsRouterLinkItemProps } from '@/ui/tabs/tabs.props'

import TabsItemContent from './TabsItemContent.vue'

const props = withDefaults(defineProps<TabsRouterLinkItemProps>(), {
  isDisabled: false,
  count: null,
  disabledReason: null,
  icon: undefined,
})

const tabsContext = useInjectTabsContext()
const variants = tabsContext.variants
const tabId = useId()

type TabsRegistration = Parameters<typeof tabsContext.registerTab>[0]

const router = useRouter()

const routeName = computed<string>(() => {
  const resolved = router.resolve(props.to)

  return resolved.name as string
})

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
    value: routeName.value,
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
  routeName.value,
], syncTabData)
</script>

<template>
  <UIActionTooltip
    v-if="shouldRenderTrigger"
    :is-disabled="props.disabledReason == null"
    :label="props.disabledReason"
  >
    <div>
      <ClickableElement>
        <RekaTabsTrigger
          :value="routeName"
          :disabled="props.isDisabled"
          :as-child="true"
          :class="variants.item()"
        >
          <RouterLink
            :to="props.to"
            :replace="true"
          >
            <TabsItemContent
              :count="props.count"
              :icon="props.icon"
              :is-label-hidden="props.isLabelHidden"
              :label="props.label"
            />
          </RouterLink>
        </RekaTabsTrigger>
      </ClickableElement>
    </div>
  </UIActionTooltip>
</template>
