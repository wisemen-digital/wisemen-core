<script setup lang="ts">
import { ref } from 'vue'

import NumberField from '@/components/number-field/NumberField.vue'

const value = ref<number | null>(null)
</script>

<template>
  <Story title="Number Field">
    <NumberField
      v-model="value"
      :hide-controls="false"
      :min="50"
      label="Number"
    />
  </Story>
</template>
