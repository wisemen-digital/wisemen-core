<script setup lang="ts">
import { ref } from 'vue'

import Slider from '@/ui/slider/Slider.vue'

const defaultMd = ref<number[]>([40])
const defaultSm = ref<number[]>([40])
const disabledValue = ref<number[]>([60])
const errorValue = ref<number[]>([30])
const withHintValue = ref<number[]>([70])
const withLabelsValue = ref<number[]>([55])
</script>

<template>
  <div class="flex flex-col gap-8 p-xl w-80">
    <Slider
      v-model="defaultMd"
      label="Default (md)"
      size="md"
    />
    <Slider
      v-model="defaultSm"
      label="Default (sm)"
      size="sm"
    />
    <Slider
      v-model="disabledValue"
      :is-disabled="true"
      label="Disabled"
    />
    <Slider
      v-model="errorValue"
      error-message="Value out of range"
      label="Error"
    />
    <Slider
      v-model="withHintValue"
      hint="Drag to adjust the value"
      label="With hint"
    />
    <Slider
      v-model="withLabelsValue"
      :show-value-labels="true"
      label="With value label"
    />
  </div>
</template>
