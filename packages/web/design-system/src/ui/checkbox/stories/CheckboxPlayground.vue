<script setup lang="ts">
import { ref } from 'vue'

import Checkbox from '@/ui/checkbox/Checkbox.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isHorizontal?: boolean
  label?: string
}>(), {
  isDisabled: false,
  isHorizontal: false,
  label: 'Checkbox Label',
})

const modelValue = ref<boolean>(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Checkbox
      v-model="modelValue"
      :is-disabled="props.isDisabled"
      :is-horizontal="props.isHorizontal"
      :label="props.label"
    />
  </div>
</template>
