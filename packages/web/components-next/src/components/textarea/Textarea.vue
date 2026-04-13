<script setup lang="ts" generic="TValue extends string">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import TextareaInput from '@/components/textarea/parts/TextareaInput.vue'
import TextareaRoot from '@/components/textarea/parts/TextareaRoot.vue'
import type { TextareaEmits } from '@/components/textarea/textarea.emits'
import type { TextareaProps } from '@/components/textarea/textarea.props'
import type { TextareaSlots } from '@/components/textarea/textarea.slots'

const props = defineProps<TextareaProps>()

const emit = defineEmits<TextareaEmits>()

defineSlots<TextareaSlots>()

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

    <TextareaRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <slot name="top" />
      <TextareaInput />
      <slot name="bottom" />
    </TextareaRoot>
  </FormField>
</template>
