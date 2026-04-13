<script setup lang="ts">
import { ref } from 'vue'

import TextField from '@/components/text-field/TextField.vue'

const value = ref<string | null>(null)
</script>

<template>
  <Story title="TextField">
    <TextField
      v-model="value"
      :is-required="true"
      :is-disabled="true"
      hint="You can type anything"
      icon-left="search"
      label="Text field"
      placeholder="Placeholder"
      class="w-72"
    />
  </Story>
</template>
