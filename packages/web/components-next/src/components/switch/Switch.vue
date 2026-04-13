<script setup lang="ts">
import { useId } from 'vue'

import FormField from '@/components/form-field/FormField.vue'
import SwitchRoot from '@/components/switch/parts/SwitchRoot.vue'
import SwitchThumb from '@/components/switch/parts/SwitchThumb.vue'
import SwitchThumbIcon from '@/components/switch/parts/SwitchThumbIcon.vue'
import type { SwitchEmits } from '@/components/switch/switch.emits'
import type { SwitchProps } from '@/components/switch/switch.props'

const props = defineProps<SwitchProps>()

const emit = defineEmits<SwitchEmits>()

const modelValue = defineModel<boolean>({
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

    <SwitchRoot
      v-bind="props"
      :id="id"
      v-model="modelValue"
      @blur="emit('blur')"
      @focus="emit('focus')"
    >
      <SwitchThumb>
        <SwitchThumbIcon />
      </SwitchThumb>
    </SwitchRoot>
  </FormField>
</template>
