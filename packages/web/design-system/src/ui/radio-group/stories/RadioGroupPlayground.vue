<script setup lang="ts">
import { ref } from 'vue'

import RadioGroupItem from '@/ui/radio-group/RadioGroupItem.vue'
import RadioGroupRoot from '@/ui/radio-group/RadioGroupRoot.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}>(), {
  isDisabled: false,
  orientation: 'vertical',
})

const modelValue = ref<string | null>(null)
</script>

<template>
  <div class="p-xl">
    <RadioGroupRoot
      v-model="modelValue"
      :is-disabled="props.isDisabled"
      :orientation="props.orientation"
      disabled-reason="You don't have permission to change this setting"
    >
      <div
        :class="props.orientation === 'horizontal' ? 'flex-row items-center' : `
          flex-col
        `"
        class="flex gap-lg"
      >
        <RadioGroupItem
          label="Option 1"
          value="option1"
        />
        <RadioGroupItem
          label="Option 2"
          value="option2"
        />
        <RadioGroupItem
          label="Option 3"
          value="option3"
        />
      </div>
    </RadioGroupRoot>
  </div>
</template>
