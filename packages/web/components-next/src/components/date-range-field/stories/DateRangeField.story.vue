<script setup lang="ts">
import DateRangeField from '@/components/date-range-field/DateRangeField.vue'
</script>

<template>
  <Story title="Date Range Field">
    <DateRangeField
      :model-value="{
        from: null,
        until: null,
      }"
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
      label="Date"
    />
  </Story>
</template>
