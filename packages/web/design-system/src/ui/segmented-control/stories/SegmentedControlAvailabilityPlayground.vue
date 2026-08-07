<script setup lang="ts">
import type { SegmentedControlGroupProps } from '@/ui/segmented-control/segmentedControl.props'
import SegmentedControlGroup from '@/ui/segmented-control/SegmentedControlGroup.vue'
import SegmentedControlGroupItem from '@/ui/segmented-control/SegmentedControlGroupItem.vue'

const props = withDefaults(defineProps<SegmentedControlGroupProps>(), {
  isDescriptionCentered: true,
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
    date: '10/08',
    label: 'Ma',
    value: 'monday',
  },
  {
    date: '11/08',
    label: 'Di',
    value: 'tuesday',
  },
  {
    date: '05/08',
    label: 'Wo',
    value: 'wednesday',
  },
  {
    date: '06/08',
    label: 'Do',
    value: 'thursday',
  },
  {
    date: '07/08',
    label: 'Vr',
    value: 'friday',
  },
  {
    date: '08/08',
    label: 'Za',
    value: 'saturday',
  },
  {
    date: '09/08',
    label: 'Zo',
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
      :is-description-centered="props.isDescriptionCentered"
      :is-disabled="props.isDisabled"
      :label="props.label"
      :size="props.size"
    >
      <SegmentedControlGroupItem
        v-for="day in days"
        :key="day.value"
        :description="day.date"
        :label="day.label"
        :value="day.value"
      />
    </SegmentedControlGroup>
  </div>
</template>
