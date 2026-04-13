<script setup lang="ts">
import type { FormFieldProps } from '@/components/form-field/formField.props'
import type { FormFieldSlots } from '@/components/form-field/formField.slots'
import FormFieldError from '@/components/form-field/parts/FormFieldError.vue'
import FormFieldHint from '@/components/form-field/parts/FormFieldHint.vue'
import FormFieldLabel from '@/components/form-field/parts/FormFieldLabel.vue'
import FormFieldRoot from '@/components/form-field/parts/FormFieldRoot.vue'

const props = withDefaults(defineProps<FormFieldProps>(), {
  layout: 'vertical',
})

defineSlots<FormFieldSlots>()
</script>

<template>
  <FormFieldRoot v-bind="props">
    <template v-if="props.layout === 'vertical'">
      <slot name="label">
        <FormFieldLabel />
      </slot>

      <slot />

      <slot name="error">
        <FormFieldError />
      </slot>

      <slot name="hint">
        <FormFieldHint />
      </slot>
    </template>

    <template v-if="props.layout === 'horizontal'">
      <slot />

      <slot name="label">
        <FormFieldLabel />
      </slot>

      <span />

      <div>
        <slot name="error">
          <FormFieldError />
        </slot>

        <slot name="hint">
          <FormFieldHint />
        </slot>
      </div>
    </template>
  </FormFieldRoot>
</template>
