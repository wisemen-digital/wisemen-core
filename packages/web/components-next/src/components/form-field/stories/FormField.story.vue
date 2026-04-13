<script setup lang="ts">
import FormField from '@/components/form-field/FormField.vue'
</script>

<template>
  <Story title="FormField">
    <FormField
      :is-required="true"
      for="input-id"
      label="Label"
      hint="Hint"
    >
      <input id="input-id">
    </FormField>
  </Story>
</template>
