<script setup lang="ts">
import { ref } from 'vue'

import DateField from '@/components/date-field/DateField.vue'

const test = ref<Date | null>(null)
</script>

<template>
  <Story title="Date Field">
    <DateField
      v-model="test as any"
      :is-disabled="false"
      :hide-date-picker="false"
      :show-two-months="false"
      :class-config="{
        datePicker: {
          weekDayLabel: 'text-error-500',
        },
      }"
      :errors="['errors']"
      icon-left="search"
      class="w-60"
      label="Date"
    />
  </Story>
</template>
