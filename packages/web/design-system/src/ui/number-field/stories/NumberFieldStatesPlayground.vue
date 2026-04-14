<script setup lang="ts">
import { ref } from 'vue'

import NumberField from '@/ui/number-field/NumberField.vue'

const counterValue = ref<number | null>(5)
const defaultValue = ref<number | null>(null)
const disabledCounterValue = ref<number | null>(3)
const disabledValue = ref<number | null>(100)
const errorValue = ref<number | null>(150)
const filledValue = ref<number | null>(42)
const loadingValue = ref<number | null>(null)
const readonlyCounterValue = ref<number | null>(7)
const readonlyValue = ref<number | null>(50)
const requiredValue = ref<number | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <NumberField
      v-model="defaultValue"
      class="w-64"
      label="Default"
      placeholder="Enter a number"
    />
    <NumberField
      v-model="filledValue"
      class="w-64"
      label="Filled"
      placeholder="Enter a number"
    />
    <NumberField
      v-model="disabledValue"
      :is-disabled="true"
      class="w-64"
      label="Disabled"
      placeholder="Enter a number"
    />
    <NumberField
      v-model="readonlyValue"
      :is-readonly="true"
      class="w-64"
      label="Read Only"
    />
    <NumberField
      v-model="loadingValue"
      :is-loading="true"
      class="w-64"
      label="Loading"
      placeholder="Loading..."
    />
    <NumberField
      v-model="errorValue"
      class="w-64"
      error-message="Value must be between 1 and 100"
      label="Error"
    />
    <NumberField
      v-model="requiredValue"
      :is-required="true"
      class="w-64"
      label="Required"
      placeholder="Required field"
    />
    <NumberField
      v-model="counterValue"
      :show-controls="true"
      :step="1"
      class="w-64"
      label="Counter"
    />
    <NumberField
      v-model="disabledCounterValue"
      :is-disabled="true"
      :show-controls="true"
      :step="1"
      class="w-64"
      label="Disabled Counter"
    />
    <NumberField
      v-model="readonlyCounterValue"
      :is-readonly="true"
      :show-controls="true"
      :step="1"
      class="w-64"
      label="Read Only Counter"
    />
  </div>
</template>
