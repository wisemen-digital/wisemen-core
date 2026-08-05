<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { RadioGroupRoot as RekaRadioGroupRoot } from 'reka-ui'
import {
  computed,
  useId,
  useTemplateRef,
} from 'vue'

import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import { useSegmentedControlDescriptionTracker } from '@/ui/segmented-control/segmentedControl.composable'
import { useProvideSegmentedControlContext } from '@/ui/segmented-control/segmentedControl.context'
import type { SegmentedControlProps } from '@/ui/segmented-control/segmentedControl.props'
import { SEGMENTED_CONTROL_DEFAULTS } from '@/ui/segmented-control/segmentedControl.props'
import type { SegmentedControlStyle } from '@/ui/segmented-control/segmentedControl.style'
import { createSegmentedControlStyle } from '@/ui/segmented-control/segmentedControl.style'
import SegmentedControlIndicator from '@/ui/segmented-control/SegmentedControlIndicator.vue'

const props = withDefaults(defineProps<SegmentedControlProps>(), SEGMENTED_CONTROL_DEFAULTS)

const modelValue = defineModel<TValue>({
  required: true,
})

const id = useId()

const listRef = useTemplateRef('list')

const {
  hasDescription,
  registerItem,
  unregisterItem,
} = useSegmentedControlDescriptionTracker()

const variants = computed<SegmentedControlStyle>(() => createSegmentedControlStyle({
  hasDescription: hasDescription.value,
  isDescriptionCentered: props.isDescriptionCentered,
  size: props.size,
}))

useProvideSegmentedControlContext({
  hasDescription,
  isDescriptionCentered: computed<boolean>(() => props.isDescriptionCentered),
  isDisabled: computed<boolean>(() => props.isDisabled),
  modelValue,
  orientation: computed<'horizontal' | 'vertical'>(() => props.orientation),
  registerItem,
  unregisterItem,
  variants,
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-horizontal="props.isHorizontal"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :label="props.label"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
    :is-error-message-hidden="props.isErrorMessageHidden"
    :is-label-hidden="props.isLabelHidden"
  >
    <RekaRadioGroupRoot
      :id="id"
      v-model="modelValue"
      :orientation="props.orientation"
      :disabled="props.isDisabled"
    >
      <div
        ref="list"
        :data-orientation="props.orientation"
        :class="variants.list()"
      >
        <slot />

        <SegmentedControlIndicator :list-ref="listRef" />
      </div>
    </RekaRadioGroupRoot>
  </InputWrapper>
</template>
