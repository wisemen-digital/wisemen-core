<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import DatePicker from '@/ui/date-picker/DatePicker.vue'

const props = withDefaults(defineProps<{
  maxDate?: Temporal.PlainDate | null
  minDate?: Temporal.PlainDate | null
}>(), {
  maxDate: null,
  minDate: null,
})

const modelValue = ref<Temporal.PlainDate | null>(null)
</script>

<template>
  <div class="flex flex-col gap-md">
    <DatePicker
      v-model="modelValue"
      :min-date="props.minDate ?? null"
      :max-date="props.maxDate ?? null"
      class="overflow-hidden rounded-2xl border border-secondary shadow-lg"
    />
  </div>
</template>
