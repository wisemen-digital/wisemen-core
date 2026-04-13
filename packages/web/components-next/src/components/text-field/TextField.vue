<script setup lang="ts" generic="TValue extends string">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import TextFieldIconLeft from '@/components/text-field/parts/TextFieldIconLeft.vue'
import TextFieldIconRight from '@/components/text-field/parts/TextFieldIconRight.vue'
import TextFieldInput from '@/components/text-field/parts/TextFieldInput.vue'
import TextFieldLoader from '@/components/text-field/parts/TextFieldLoader.vue'
import TextFieldRoot from '@/components/text-field/parts/TextFieldRoot.vue'
import type {
  TextFieldEmits,
  TextFieldProps,
} from '@/components/text-field/textField.props'
import type { TextFieldSlots } from '@/components/text-field/textField.slots'

const props = defineProps<TextFieldProps>()
const emit = defineEmits<TextFieldEmits>()

defineSlots<TextFieldSlots>()

const modelValue = defineModel<TValue | null>({
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

    <TextFieldRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <slot name="left" />
      <TextFieldIconLeft />
      <TextFieldInput />
      <TextFieldLoader />
      <TextFieldIconRight />
      <slot name="right" />
    </TextFieldRoot>
  </FormField>
</template>
