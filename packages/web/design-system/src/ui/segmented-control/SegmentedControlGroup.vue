<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { CheckboxGroupRoot as RekaCheckboxGroupRoot } from 'reka-ui'
import {
  computed,
  useId,
} from 'vue'

import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import { useSegmentedControlDescriptionTracker } from '@/ui/segmented-control/segmentedControl.composable'
import type { SegmentedControlGroupProps } from '@/ui/segmented-control/segmentedControl.props'
import { SEGMENTED_CONTROL_GROUP_DEFAULTS } from '@/ui/segmented-control/segmentedControl.props'
import type { SegmentedControlGroupStyle } from '@/ui/segmented-control/segmentedControl.style'
import { createSegmentedControlGroupStyle } from '@/ui/segmented-control/segmentedControl.style'
import { useProvideSegmentedControlGroupContext } from '@/ui/segmented-control/segmentedControlGroup.context'

const props = withDefaults(defineProps<SegmentedControlGroupProps>(), SEGMENTED_CONTROL_GROUP_DEFAULTS)

const modelValue = defineModel<TValue[]>({
  required: true,
})

const id = useId()

const {
  hasDescription,
  registerItem,
  unregisterItem,
} = useSegmentedControlDescriptionTracker()

const variants = computed<SegmentedControlGroupStyle>(() => createSegmentedControlGroupStyle({
  hasDescription: hasDescription.value,
  isDescriptionCentered: props.isDescriptionCentered,
  size: props.size,
}))

useProvideSegmentedControlGroupContext({
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
    <RekaCheckboxGroupRoot
      :id="id"
      v-model="modelValue"
      :disabled="props.isDisabled"
    >
      <div
        :data-orientation="props.orientation"
        :class="variants.list()"
      >
        <slot />
      </div>
    </RekaCheckboxGroupRoot>
  </InputWrapper>
</template>
