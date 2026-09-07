<script setup lang="ts">
import { RadioGroupItem as RekaRadioGroupItem } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  onMounted,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { UIColumnLayout } from '@/ui/column-layout/index'
import { useInjectSegmentedControlContext } from '@/ui/segmented-control/segmentedControl.context'
import type { SegmentedControlItemProps } from '@/ui/segmented-control/segmentedControl.props'
import { SEGMENTED_CONTROL_ITEM_DEFAULTS } from '@/ui/segmented-control/segmentedControl.props'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<SegmentedControlItemProps>(), SEGMENTED_CONTROL_ITEM_DEFAULTS)

const {
  isDescriptionCentered,
  registerItem,
  unregisterItem,
  variants,
} = useInjectSegmentedControlContext()

const hasDescription = computed<boolean>(() => props.description != null)

onMounted(() => {
  registerItem(hasDescription.value)
})

onBeforeUnmount(() => {
  unregisterItem(hasDescription.value)
})
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <RekaRadioGroupItem
      :disabled="props.isDisabled"
      :value="props.value"
      :class="variants.item()"
    >
      <UIColumnLayout
        :align="isDescriptionCentered ? 'center' : 'start'"
        gap="none"
      >
        <UIText
          :text="props.label"
          :class="variants.label()"
        />

        <UIText
          v-if="props.description"
          :text="props.description"
          :truncate="false"
          :class="variants.description()"
        />
      </UIColumnLayout>
    </RekaRadioGroupItem>
  </ActionTooltip>
</template>
