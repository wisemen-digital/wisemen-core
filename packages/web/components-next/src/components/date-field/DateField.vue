<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { useId } from 'vue'

import type { DateFieldEmits } from '@/components/date-field/dateField.emits'
import type { DateFieldProps } from '@/components/date-field/dateField.props'
import type { DateFieldSlots } from '@/components/date-field/dateField.slots'
import type { DateFieldSegment } from '@/components/date-field/dateField.type'
import DateFieldIconLeft from '@/components/date-field/parts/DateFieldIconLeft.vue'
import DateFieldInput from '@/components/date-field/parts/DateFieldInput.vue'
import DateFieldLoader from '@/components/date-field/parts/DateFieldLoader.vue'
import DateFieldPopover from '@/components/date-field/parts/DateFieldPopover.vue'
import DateFieldRoot from '@/components/date-field/parts/DateFieldRoot.vue'
import FormField from '@/components/form-field/FormField.vue'

const props = defineProps<DateFieldProps>()
const emit = defineEmits<DateFieldEmits>()

defineSlots<DateFieldSlots>()

const modelValue = defineModel<Temporal.PlainDate | null>({
  required: true,
})
const placeholderValue = defineModel<Temporal.PlainDate | null>('placeholderValue', {
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

    <template #default>
      <DateFieldRoot
        v-bind="props"
        :id="id"
        v-slot="{ segments }"
        v-model="modelValue"
        v-model:placeholder-value="placeholderValue"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      >
        <slot name="left" />
        <DateFieldIconLeft />
        <DateFieldInput :segments="(segments as DateFieldSegment[])" />
        <DateFieldLoader />
        <DateFieldPopover />
      </DateFieldRoot>
    </template>
  </FormField>
</template>
