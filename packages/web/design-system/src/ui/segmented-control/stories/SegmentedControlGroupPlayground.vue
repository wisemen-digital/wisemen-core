<script setup lang="ts">
import type { SegmentedControlGroupProps } from '@/ui/segmented-control/segmentedControl.props'
import SegmentedControlGroup from '@/ui/segmented-control/SegmentedControlGroup.vue'
import SegmentedControlGroupItem from '@/ui/segmented-control/SegmentedControlGroupItem.vue'

const props = withDefaults(defineProps<SegmentedControlGroupProps>(), {
  isDisabled: false,
  disabledReason: null,
  errorMessage: null,
  hint: null,
  label: null,
  size: 'md',
})

const modelValue = defineModel<string[]>({
  required: true,
})

const days = [
  {
    label: 'Mo',
    value: 'monday',
  },
  {
    label: 'Tu',
    value: 'tuesday',
  },
  {
    label: 'We',
    value: 'wednesday',
  },
  {
    label: 'Th',
    value: 'thursday',
  },
  {
    label: 'Fr',
    value: 'friday',
  },
  {
    label: 'Sa',
    value: 'saturday',
  },
  {
    label: 'Su',
    value: 'sunday',
  },
]
</script>

<template>
  <div class="p-xl">
    <SegmentedControlGroup
      v-model="modelValue"
      :disabled-reason="props.disabledReason"
      :error-message="props.errorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :label="props.label"
      :size="props.size"
    >
      <SegmentedControlGroupItem
        v-for="day in days"
        :key="day.value"
        :label="day.label"
        :value="day.value"
      />
    </SegmentedControlGroup>
  </div>
</template>
