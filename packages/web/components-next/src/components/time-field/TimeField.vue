<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import TimeFieldIconLeft from '@/components/time-field/parts/TimeFieldIconLeft.vue'
import TimeFieldIconRight from '@/components/time-field/parts/TimeFieldIconRight.vue'
import TimeFieldInput from '@/components/time-field/parts/TimeFieldInput.vue'
import TimeFieldLoader from '@/components/time-field/parts/TimeFieldLoader.vue'
import TimeFieldRoot from '@/components/time-field/parts/TimeFieldRoot.vue'
import type { TimeFieldEmits } from '@/components/time-field/timeField.emits'
import type { TimeFieldProps } from '@/components/time-field/timeField.props'
import type { TimeFieldSlots } from '@/components/time-field/timeField.slots'
import type { TimeFieldSegment } from '@/components/time-field/timeField.type'

const props = defineProps<TimeFieldProps>()
const emit = defineEmits<TimeFieldEmits>()

defineSlots<TimeFieldSlots>()

const modelValue = defineModel<Temporal.PlainTime | null>({
  required: true,
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

    <TimeFieldRoot
      v-bind="props"
      :id="id"
      v-slot="{ segments }"
      v-model="modelValue"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <slot name="left" />
      <TimeFieldIconLeft />
      <TimeFieldInput :segments="(segments as TimeFieldSegment[])" />
      <TimeFieldIconRight />
      <TimeFieldLoader />
    </TimeFieldRoot>
  </FormField>
</template>
