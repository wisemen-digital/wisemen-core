<script setup lang="ts">
import { BASE_RADIO_GROUP_ITEM_DEFAULTS } from '@/ui/radio-group/base/baseRadioGroup.props'
import BaseRadioGroup from '@/ui/radio-group/base/BaseRadioGroup.vue'
import type { RadioGroupItemProps } from '@/ui/radio-group/radioGroupItem.props'

const props = withDefaults(defineProps<RadioGroupItemProps>(), {
  ...BASE_RADIO_GROUP_ITEM_DEFAULTS,
})
</script>

<template>
  <BaseRadioGroup
    v-bind="props"
  />
</template>
