<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import RadioGroupItemIndicator from '@/components/radio-group-item/parts/RadioGroupItemIndicator.vue'
import RadioGroupItemIndicatorTransition from '@/components/radio-group-item/parts/RadioGroupItemIndicatorTransition.vue'
import { useInjectRadioGroupItemContext } from '@/components/radio-group-item/radioGroupItem.context'

const {
  classConfig,
  customClassConfig,
  style,
} = useInjectRadioGroupItemContext()
</script>

<template>
  <div
    :class="style.control({
      class: mergeClasses(customClassConfig?.control, classConfig?.control),
    })"
  >
    <RadioGroupItemIndicator>
      <RadioGroupItemIndicatorTransition />
    </RadioGroupItemIndicator>
  </div>
</template>
