<script setup lang="ts">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import type { NumberFieldEmits } from '@/components/number-field/numberField.emits'
import type { NumberFieldProps } from '@/components/number-field/numberField.props'
import type { NumberFieldSlots } from '@/components/number-field/numberField.slots'
import NumberFieldDecrement from '@/components/number-field/parts/NumberFieldDecrement.vue'
import NumberFieldIconLeft from '@/components/number-field/parts/NumberFieldIconLeft.vue'
import NumberFieldIconRight from '@/components/number-field/parts/NumberFieldIconRight.vue'
import NumberFieldIncrement from '@/components/number-field/parts/NumberFieldIncrement.vue'
import NumberFieldInput from '@/components/number-field/parts/NumberFieldInput.vue'
import NumberFieldLoader from '@/components/number-field/parts/NumberFieldLoader.vue'
import NumberFieldRoot from '@/components/number-field/parts/NumberFieldRoot.vue'

const props = defineProps<NumberFieldProps>()
const emit = defineEmits<NumberFieldEmits>()

defineSlots<NumberFieldSlots>()

const modelValue = defineModel<number | null>({
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

    <NumberFieldRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <slot name="left" />
      <NumberFieldDecrement />
      <NumberFieldIconLeft />
      <NumberFieldInput />
      <NumberFieldIncrement />
      <NumberFieldIconRight />
      <NumberFieldLoader />
      <slot name="right" />
    </NumberFieldRoot>
  </FormField>
</template>
