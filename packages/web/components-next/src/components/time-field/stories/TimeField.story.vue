<script setup lang="ts">
import { ref } from 'vue'

import TimeField from '@/components/time-field/TimeField.vue'

const test = ref<string | null>(null)
</script>

<template>
  <Story title="Time Field">
    <TimeField
      v-model="test as any"
      :is-disabled="false"
      :hide-date-picker="false"
      :show-two-months="false"
      :is-required="true"
      :errors="['errors']"
      class="w-52"
      label="Date"
    />
  </Story>
</template>
