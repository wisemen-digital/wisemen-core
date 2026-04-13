<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import DatePicker from '@/components/date-picker/single/DatePicker.vue'
import DatePickerDate from '@/components/date-picker/single/parts/DatePickerDate.vue'
import Tooltip from '@/components/tooltip/Tooltip.vue'

const inTwoWeeks = Temporal.Now.plainDateISO().add({
  weeks: 2,
})
const inTwoMonths = Temporal.Now.plainDateISO().add({
  months: 2,
})

const value = ref<Temporal.PlainDate | null>(inTwoWeeks)

const today = Temporal.Now.plainDateISO()
</script>

<template>
  <Story title="DatePicker">
    <div>
      <DatePicker
        v-model="value"
        :show-two-months="false"
        :placeholder-value="inTwoMonths"
        :min-date="today"
        :is-date-disabled="(date) => date.day === 5"
        :is-date-unavailable="(date) => date.day === 15"
        :is-disabled="false"
        :allow-deselect="false"
        :focus-on-mount="false"
        :max-date="null"
        label="Example"
      >
        <template #date="{ date }">
          <Tooltip
            v-if="date.getDate() === 15"
            :disable-close-on-trigger-click="true"
          >
            <template #trigger>
              <DatePickerDate />
            </template>

            <template #content>
              <div class="px-lg py-sm">
                <p class="max-w-40 text-center text-sm text-secondary">
                  This date is unavailable. Please select another date.
                </p>
              </div>
            </template>
          </Tooltip>
        </template>
      </DatePicker>
    </div>
  </Story>
</template>
