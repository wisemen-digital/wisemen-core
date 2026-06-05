<script setup lang="ts">
import { ref } from 'vue'

import type { SliderProps } from '@/ui/slider/slider.props'
import Slider from '@/ui/slider/Slider.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isRequired?: boolean
  errorMessage?: SliderProps['errorMessage']
  hint?: SliderProps['hint']
  label?: string
  min?: number
  max?: number
  step?: number
  showValueLabels?: boolean
  size?: 'sm' | 'md'
}>(), {
  isDisabled: false,
  isRequired: false,
  errorMessage: undefined,
  hint: undefined,
  label: 'Slider Label',
  max: 100,
  min: 0,
  showValueLabels: false,
  size: 'md',
  step: 1,
})

const modelValue = ref<number[]>([50])
</script>

<template>
  <div class="w-72 p-xl">
    <Slider
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-required="props.isRequired"
      :label="props.label"
      :max="props.max"
      :min="props.min"
      :show-value-labels="props.showValueLabels"
      :size="props.size"
      :step="props.step"
    />
  </div>
</template>
