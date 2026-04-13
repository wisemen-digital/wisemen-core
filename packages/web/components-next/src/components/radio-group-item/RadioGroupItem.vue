<script setup lang="ts">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import RadioGroupItemControl from '@/components/radio-group-item/parts/RadioGroupItemControl.vue'
import RadioGroupItemRoot from '@/components/radio-group-item/parts/RadioGroupItemRoot.vue'
import type { RadioGroupItemEmits } from '@/components/radio-group-item/radioGroupItem.emits'
import type { RadioGroupItemProps } from '@/components/radio-group-item/radioGroupItem.props'

const props = defineProps<RadioGroupItemProps>()

const emit = defineEmits<RadioGroupItemEmits>()

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
    layout="horizontal"
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

    <RadioGroupItemRoot
      v-bind="props"
      :id="id"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >
      <slot>
        <RadioGroupItemControl />
      </slot>
    </RadioGroupItemRoot>
  </FormField>
</template>
