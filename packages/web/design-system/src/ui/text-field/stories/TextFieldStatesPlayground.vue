<script setup lang="ts">
import { ref } from 'vue'

import TextField from '@/ui/text-field/TextField.vue'

const defaultValue = ref<string | null>(null)
const disabledValue = ref<string | null>('Disabled')
const errorValue = ref<string | null>('Invalid input')
const filledValue = ref<string | null>('Hello World')
const loadingValue = ref<string | null>(null)
const readonlyValue = ref<string | null>('Read only')
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TextField
      v-model="defaultValue"
      class="w-64"
      label="Default"
      placeholder="Enter text..."
    />
    <TextField
      v-model="filledValue"
      class="w-64"
      label="Filled"
      placeholder="Enter text..."
    />
    <TextField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-64"
      label="Disabled"
      disabled-reason="You don't have permission to edit this field"
      placeholder="Enter text..."
    />
    <TextField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-64"
      label="Read Only"
    />
    <TextField
      v-model="loadingValue"
      :is-loading="true"
      class="w-64"
      label="Loading"
      placeholder="Loading..."
    />
    <TextField
      v-model="errorValue"
      class="w-64"
      error-message="This field has an error"
      label="Error"
    />
    <TextField
      v-model="filledValue"
      class="w-64"
      label="Help"
      help-text="This field has an error with help text"
    />
  </div>
</template>
