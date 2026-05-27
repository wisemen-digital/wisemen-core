<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import TimeField from '@/ui/time-field/TimeField.vue'

const withSnappingValue = ref<Temporal.PlainTime | null>(null)
const withoutSnappingValue = ref<Temporal.PlainTime | null>(null)
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <TimeField
      v-model="withSnappingValue"
      :step="{ minute: 15 }"
      :step-snapping="true"
      class="w-56"
      hint="Typed values snap to nearest 15-minute mark"
      label="With step snapping"
    />

    <TimeField
      v-model="withoutSnappingValue"
      :step="{ minute: 15 }"
      :step-snapping="false"
      class="w-56"
      hint="Typed values are kept as-is"
      label="Without step snapping"
    />
  </div>
</template>
