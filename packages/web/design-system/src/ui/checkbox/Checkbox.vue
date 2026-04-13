<script setup lang="ts">
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import type { CheckboxProps } from '@/ui/checkbox/checkbox.props'

const props = defineProps<CheckboxProps>()

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<boolean>({
  required: true,
})
</script>

<template>
  <BaseCheckbox
    v-bind="props"
    v-model="modelValue"
    @blur="emit('blur')"
  />
</template>
