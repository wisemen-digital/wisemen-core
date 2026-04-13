<script setup lang="ts">
import { ref } from 'vue'

import TextareaField from '@/ui/textarea-field/TextareaField.vue'

const defaultValue = ref<string | null>(null)
const disabledValue = ref<string | null>('Disabled')
const errorValue = ref<string | null>('Invalid input')
const filledValue = ref<string | null>('Hello World')
const readonlyValue = ref<string | null>('Read only')
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TextareaField
      v-model="defaultValue"
      class="w-64"
      label="Default"
      placeholder="Enter text..."
    />
    <TextareaField
      v-model="filledValue"
      class="w-64"
      label="Filled"
      placeholder="Enter text..."
    />
    <TextareaField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-64"
      label="Disabled"
      placeholder="Enter text..."
    />
    <TextareaField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-64"
      label="Read Only"
    />
    <TextareaField
      v-model="errorValue"
      class="w-64"
      error-message="This field has an error"
      label="Error"
    />
  </div>
</template>
