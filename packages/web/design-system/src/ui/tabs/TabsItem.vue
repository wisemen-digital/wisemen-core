<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import {
  onBeforeUnmount,
  onMounted,
} from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import { UIAdaptiveContentBlock } from '@/ui/adaptive-content/index'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import { UINumberBadge } from '@/ui/number-badge/index'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsItemProps } from '@/ui/tabs/tabs.props'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<TabsItemProps>(), {
  isDisabled: false,
  count: null,
  disabledReason: null,
  icon: undefined,
})

const {
  isTouchDevice,
  registerTab,
  unregisterTab,
  variants,
} = useInjectTabsContext()

const priority = registerTab({
  ...props,
})

onMounted(() => {
})

onBeforeUnmount(() => {
  unregisterTab(props.value)
})
</script>

<template>
  <UIActionTooltip
    v-if="!isTouchDevice"
    :is-disabled="props.disabledReason == null"
    :label="props.disabledReason"
  >
    <UIAdaptiveContentBlock :priority="priority">
      <ClickableElement>
        <RekaTabsTrigger
          :value="props.value"
          :disabled="props.isDisabled"
          :class="variants.item()"
        >
          <component
            :is="props.icon"
            v-if="props.icon != null"
            class="size-4 shrink-0"
          />
          <UIText
            :text="props.label"
            :class="{
              'sr-only': props.isLabelHidden,
            }"
            class="text-xs"
          />
          <UINumberBadge
            v-if="props.count != null"
            :value="props.count.toString()"
            size="md"
          />
        </RekaTabsTrigger>
      </ClickableElement>
    </UIAdaptiveContentBlock>
  </UIActionTooltip>

  <UIActionTooltip
    v-else
    :is-disabled="props.disabledReason == null"
    :label="props.disabledReason"
  >
    <ClickableElement>
      <RekaTabsTrigger
        :value="props.value"
        :disabled="props.isDisabled"
        :class="variants.item()"
      >
        <component
          :is="props.icon"
          v-if="props.icon != null"
          class="size-4 shrink-0"
        />
        <UIText
          :text="props.label"
          :class="{
            'sr-only': props.isLabelHidden,
          }"
          class="text-xs"
        />
        <UINumberBadge
          v-if="props.count != null"
          :value="props.count.toString()"
          size="md"
        />
      </RekaTabsTrigger>
    </ClickableElement>
  </UIActionTooltip>
</template>
