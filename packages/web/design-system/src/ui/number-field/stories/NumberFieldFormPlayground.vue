<script setup lang="ts">
import { ref } from 'vue'

import NumberField from '@/ui/number-field/NumberField.vue'

const age = ref<number | null>(null)
const height = ref<number | null>(null)
const quantity = ref<number | null>(1)
const weight = ref<number | null>(null)
</script>

<template>
  <form
    class="flex max-w-md flex-col gap-4"
    @submit.prevent
  >
    <div class="flex gap-4">
      <NumberField
        v-model="age"
        :is-required="true"
        :max="150"
        :min="0"
        class="flex-1"
        label="Age"
        placeholder="Years"
      />
      <NumberField
        v-model="height"
        :min="0"
        class="flex-1"
        label="Height"
        placeholder="cm"
      />
    </div>
    <NumberField
      v-model="weight"
      :min="0"
      hint="In kilograms"
      label="Weight"
      placeholder="kg"
    />
    <NumberField
      v-model="quantity"
      :is-required="true"
      :max="99"
      :min="1"
      :show-controls="true"
      :step="1"
      hint="How many items?"
      label="Quantity"
    />
  </form>
</template>
