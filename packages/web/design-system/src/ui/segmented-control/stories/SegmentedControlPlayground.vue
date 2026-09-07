<script setup lang="ts">
import type { SegmentedControlProps } from '@/ui/segmented-control/segmentedControl.props'
import SegmentedControl from '@/ui/segmented-control/SegmentedControl.vue'
import SegmentedControlItem from '@/ui/segmented-control/SegmentedControlItem.vue'

const props = withDefaults(defineProps<SegmentedControlProps & {
  hasDescriptions?: boolean
}>(), {
  hasDescriptions: false,
  isDisabled: false,
  disabledReason: null,
  errorMessage: null,
  hint: null,
  label: null,
  size: 'md',
})

const modelValue = defineModel<string>({
  required: true,
})
</script>

<template>
  <div class="p-xl">
    <SegmentedControl
      v-model="modelValue"
      :disabled-reason="props.disabledReason"
      :error-message="props.errorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :label="props.label"
      :size="props.size"
    >
      <SegmentedControlItem
        :description="props.hasDescriptions ? 'Never notify me' : null"
        label="Off"
        value="off"
      />
      <SegmentedControlItem
        :description="props.hasDescriptions ? 'Send me an email' : null"
        label="Email"
        value="email"
      />
      <SegmentedControlItem
        :description="props.hasDescriptions ? 'Show in the app' : null"
        label="In-app"
        value="in-app"
      />
      <SegmentedControlItem
        :description="props.hasDescriptions ? 'Email and in-app' : null"
        label="Both"
        value="both"
      />
    </SegmentedControl>
  </div>
</template>
