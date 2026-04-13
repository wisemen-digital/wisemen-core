<script setup lang="ts">
import { ref } from 'vue'

import TextField from '@/ui/text-field/TextField.vue'

const mdValue = ref<string | null>(null)
const smValue = ref<string | null>(null)
</script>

<template>
  <div class="flex items-end gap-4">
    <TextField
      v-model="smValue"
      class="w-64"
      label="Small (sm)"
      placeholder="Small size"
      size="sm"
    />
    <TextField
      v-model="mdValue"
      class="w-64"
      label="Medium (md)"
      placeholder="Medium size"
      size="md"
    />
  </div>
</template>
