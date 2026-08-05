<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import { computed } from 'vue'
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
  config: null,
  count: null,
  disabledReason: null,
  icon: undefined,
})

const tabsContext = useInjectTabsContext()
const variants = tabsContext.variants
const router = useRouter()

const routeName = computed<string>(() => {
  const resolved = router.resolve(props.to)

  return resolved.name as string
})
</script>

<template>
  <UIActionTooltip
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
              :config="props.config"
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
