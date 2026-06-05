<script setup lang="ts">
import {
  SliderRange as RekaSliderRange,
  SliderRoot as RekaSliderRoot,
  SliderTrack as RekaSliderTrack,
} from 'reka-ui'
import { computed } from 'vue'

import {
  INPUT_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import { useProvideSliderContext } from '@/ui/slider/slider.context'
import type { SliderProps } from '@/ui/slider/slider.props'
import type { SliderStyle } from '@/ui/slider/slider.style'
import { createSliderStyle } from '@/ui/slider/slider.style'
import SliderThumb from '@/ui/slider/SliderThumb.vue'

const props = withDefaults(defineProps<SliderProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  max: 100,
  min: 0,
  minStepsBetweenThumbs: 0,
  showValueLabels: false,
  size: 'md',
  step: 1,
})

const modelValue = defineModel<number[]>({
  required: true,
})

const sliderStyle = computed<SliderStyle>(() => createSliderStyle({
  size: props.size,
}))

const isError = computed<boolean>(() => props.errorMessage != null && props.errorMessage !== '')

useProvideSliderContext({
  isDisabled: computed<boolean>(() => props.isDisabled ?? false),
  showValueLabels: computed<boolean>(() => props.showValueLabels ?? false),
  size: computed<'md' | 'sm'>(() => props.size ?? 'md'),
  sliderStyle,
})

function getLabelPosition(value: number): string {
  const min = props.min ?? 0
  const max = props.max ?? 100

  return `${((value - min) / (max - min)) * 100}%`
}
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :help-text="props.helpText"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :hide-error-message="props.hideErrorMessage"
    :is-label-hidden="props.isLabelHidden"
  >
    <RekaSliderRoot
      v-model="modelValue"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :min-steps-between-thumbs="props.minStepsBetweenThumbs"
      :disabled="props.isDisabled"
      :name="props.name ?? undefined"
      :data-invalid="isError || undefined"
      :class="sliderStyle.root()"
    >
      <div :class="sliderStyle.trackContainer()">
        <RekaSliderTrack :class="sliderStyle.track()">
          <RekaSliderRange :class="sliderStyle.range()" />
        </RekaSliderTrack>

        <SliderThumb
          v-for="(_, i) in modelValue"
          :key="i"
        />
      </div>

      <div
        v-if="props.showValueLabels"
        :class="sliderStyle.labelsRow()"
      >
        <span
          v-for="(value, i) in modelValue"
          :key="i"
          :style="{ left: getLabelPosition(value) }"
          :class="sliderStyle.valueLabel()"
        >
          {{ value }}
        </span>
      </div>
    </RekaSliderRoot>
  </InputWrapper>
</template>
