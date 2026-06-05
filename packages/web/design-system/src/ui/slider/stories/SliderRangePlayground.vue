<script setup lang="ts">
import { ref } from 'vue'

import Slider from '@/ui/slider/Slider.vue'

const rangeValue = ref<number[]>([20, 80])
const rangeWithLabels = ref<number[]>([25, 75])
const rangeSmall = ref<number[]>([30, 70])
</script>

<template>
  <div class="flex flex-col gap-8 p-xl w-80">
    <Slider
      v-model="rangeValue"
      :min-steps-between-thumbs="5"
      label="Range slider"
    />
    <Slider
      v-model="rangeWithLabels"
      :min-steps-between-thumbs="5"
      :show-value-labels="true"
      label="Range with labels"
    />
    <Slider
      v-model="rangeSmall"
      :min-steps-between-thumbs="5"
      label="Range (sm)"
      size="sm"
    />
  </div>
</template>
