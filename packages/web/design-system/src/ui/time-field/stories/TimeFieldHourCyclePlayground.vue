<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import TimeField from '@/ui/time-field/TimeField.vue'

const value12 = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:30'))
const value24 = ref<Temporal.PlainTime | null>(Temporal.PlainTime.from('14:30'))
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <ConfigProvider
      locale="en-US"
      hour-cycle="12-hour"
    >
      <TimeField
        v-model="value12"
        class="w-56"
        hint="12-hour from ConfigProvider"
        label="Time (12-hour)"
      />
    </ConfigProvider>

    <ConfigProvider
      locale="en-US"
      hour-cycle="24-hour"
    >
      <TimeField
        v-model="value24"
        class="w-56"
        hint="24-hour from ConfigProvider"
        label="Time (24-hour)"
      />
    </ConfigProvider>
  </div>
</template>
