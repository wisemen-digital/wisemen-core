<script setup lang="ts">
import { SliderThumb as RekaSliderThumb } from 'reka-ui'

import { useInjectSliderContext } from '@/ui/slider/slider.context'

const { sliderStyle } = useInjectSliderContext()
</script>

<template>
  <RekaSliderThumb :class="sliderStyle.thumb()" />
</template>
