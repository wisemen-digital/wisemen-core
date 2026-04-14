<script setup lang="ts">
import { ref } from 'vue'

import TextareaField from '@/ui/textarea-field/TextareaField.vue'

const noneValue = ref<string | null>(null)
const verticalValue = ref<string | null>(null)
const autoVerticalValue = ref<string | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TextareaField
      v-model="noneValue"
      class="w-64"
      label="None (default)"
      placeholder="Cannot resize..."
      resize="none"
    />
    <TextareaField
      v-model="verticalValue"
      class="w-64"
      label="Vertical"
      placeholder="Resize vertically..."
      resize="vertical"
    />
    <TextareaField
      v-model="autoVerticalValue"
      class="w-64"
      label="Auto Vertical"
      placeholder="Auto grows with content..."
      resize="auto-vertical"
    />
  </div>
</template>
