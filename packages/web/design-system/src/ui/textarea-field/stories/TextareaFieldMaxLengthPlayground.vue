<script setup lang="ts">
import { ref } from 'vue'

import TextareaField from '@/ui/textarea-field/TextareaField.vue'

const defaultValue = ref<string | null>(null)
const prefilledValue = ref<string | null>('This is some prefilled text to show the counter.')
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TextareaField
      v-model="defaultValue"
      :max-length="500"
      class="w-64"
      label="With max length"
      placeholder="Type something..."
      resize="auto-vertical"
    />
    <TextareaField
      v-model="prefilledValue"
      :max-length="100"
      resize="vertical"
      class="w-64"
      label="Short limit"
      placeholder="Max 100 characters..."
    />
  </div>
</template>
