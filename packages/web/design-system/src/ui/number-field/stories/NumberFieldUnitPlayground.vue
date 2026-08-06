<script setup lang="ts">
import { ref } from 'vue'

import NumberField from '@/ui/number-field/NumberField.vue'

const modelValue = ref<number | null>(0)
</script>

<template>
  <div>
    <NumberField
      v-model="modelValue"
      :format-options="{
        style: 'unit',
        unit: 'minute',
        unitDisplay: 'short',
      }"
      :has-controls="true"
      label="Flexibility"
      class="w-72"
    />
  </div>
</template>
