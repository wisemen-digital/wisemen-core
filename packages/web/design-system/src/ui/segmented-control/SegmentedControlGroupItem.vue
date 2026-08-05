<script setup lang="ts">
import { CheckboxRoot as RekaCheckboxRoot } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  onMounted,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { UIColumnLayout } from '@/ui/column-layout/index'
import type { SegmentedControlItemProps } from '@/ui/segmented-control/segmentedControl.props'
import { SEGMENTED_CONTROL_ITEM_DEFAULTS } from '@/ui/segmented-control/segmentedControl.props'
import { useInjectSegmentedControlGroupContext } from '@/ui/segmented-control/segmentedControlGroup.context'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<SegmentedControlItemProps>(), SEGMENTED_CONTROL_ITEM_DEFAULTS)

const {
  isDescriptionCentered,
  orientation,
  registerItem,
  unregisterItem,
  variants,
} = useInjectSegmentedControlGroupContext()

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
    <RekaCheckboxRoot
      :disabled="props.isDisabled"
      :value="props.value"
      :data-orientation="orientation"
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
    </RekaCheckboxRoot>
  </ActionTooltip>
</template>
