<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { useId } from 'vue'

import type { DateRangeFieldEmits } from '@/components/date-range-field/dateRangeField.emits'
import type { DateRangeFieldProps } from '@/components/date-range-field/dateRangeField.props'
import type { DateRangeFieldSlots } from '@/components/date-range-field/dateRangeField.slots'
import type { DateRangeFieldSegment } from '@/components/date-range-field/dateRangeField.type'
import DateRangeFieldIconLeft from '@/components/date-range-field/parts/DateRangeFieldIconLeft.vue'
import DateRangeFieldInput from '@/components/date-range-field/parts/DateRangeFieldInput.vue'
import DateRangeFieldLoader from '@/components/date-range-field/parts/DateRangeFieldLoader.vue'
import DateRangefieldPopover from '@/components/date-range-field/parts/DateRangefieldPopover.vue'
import DateRangeFieldRoot from '@/components/date-range-field/parts/DateRangeFieldRoot.vue'
import FormField from '@/components/form-field/FormField.vue'
import type { DateRange } from '@/types/dateRange.type'

const props = defineProps<DateRangeFieldProps>()
const emit = defineEmits<DateRangeFieldEmits>()

defineSlots<DateRangeFieldSlots>()

const modelValue = defineModel<DateRange<Temporal.PlainDate>>({
  required: true,
})

const placeholderValue = defineModel<Temporal.PlainDate>('placeholderValue', {
  required: false,
})

const id = props.id ?? useId()
</script>

<template>
  <FormField
    :error-message="props.errorMessage"
    :hint="props.hint"
    :is-required="props.isRequired"
    :is-touched="props.isTouched"
    :label="props.label"
    :for="id"
  >
    <template #label>
      <slot name="label" />
    </template>

    <template #error>
      <slot name="error" />
    </template>

    <template #hint>
      <slot name="hint" />
    </template>

    <DateRangeFieldRoot
      v-bind="props"
      :id="id"
      v-slot="{ segments }"
      v-model="modelValue"
      v-model:placeholder-value="placeholderValue"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <slot name="left" />
      <DateRangeFieldIconLeft />
      <DateRangeFieldInput :segments="(segments as DateRangeFieldSegment)" />
      <DateRangeFieldLoader />
      <DateRangefieldPopover />
    </DateRangeFieldRoot>
  </FormField>
</template>
