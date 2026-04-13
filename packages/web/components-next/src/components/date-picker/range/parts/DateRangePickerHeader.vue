<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import {
  RangeCalendarHeader as RekaRangeCalendarHeader,
  RangeCalendarHeading as RekaRangeCalendarHeading,
  RangeCalendarNext as RekaRangeCalendarNext,
  RangeCalendarPrev as RekaRangeCalendarPrev,
} from 'reka-ui'
import {
  computed,
  nextTick,
} from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import IconButton from '@/components/button/icon-button/IconButton.vue'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import { useInjectDateRangePickerContext } from '@/components/date-picker/range/dateRangePicker.context'
import type { Grid } from '@/components/date-picker/shared/datePicker.type'
import { getMonthName } from '@/components/date-picker/shared/datePicker.util'
import NumberField from '@/components/number-field/NumberField.vue'
import SelectItem from '@/components/select/parts/SelectItem.vue'
import Select from '@/components/select/Select.vue'

const props = defineProps<{
  grid: Grid<DateValue>[]
}>()

const {
  locale,
} = useInjectConfigContext()

const {
  classConfig,
  customClassConfig,
  placeholderValue,
  showTwoMonths,
  style,
} = useInjectDateRangePickerContext()

const monthValue = computed<number>({
  get: () => placeholderValue.value.month - 1,
  set: async (value) => {
    // Without nextTick, an stack overflow occurs for some weird reason
    // Took me about 2 hours to figure this out
    await nextTick()

    placeholderValue.value = placeholderValue.value.with({
      month: value + 1,
    })
  },
})

const yearValue = computed<number>({
  get: () => {
    return placeholderValue.value.year
  },
  set: (value) => {
    placeholderValue.value = placeholderValue.value.with({
      year: value,
    })
  },
})
</script>

<template>
  <div
    :class="style.headerContainer({
      class: mergeClasses(customClassConfig.headerContainer, classConfig?.headerContainer),
    })"
    class="flex"
  >
    <RekaRangeCalendarHeader
      v-for="(month, index) of props.grid"
      :key="index"
      :class="style.header({
        class: mergeClasses(customClassConfig.header, classConfig?.header),
      })"
    >
      <RekaRangeCalendarPrev
        v-if="index === 0"
        :as-child="true"
      >
        <IconButton
          :class-config="{
            icon: 'group-enabled/button:group-hover/button:-translate-x-px group-enabled/button:group-active/button:-translate-x-0.5 duration-200',
          }"
          icon="chevronLeft"
          label="Previous month"
          variant="tertiary"
          size="sm"
          class="justify-self-start"
        />
      </RekaRangeCalendarPrev>

      <span v-else />

      <RekaRangeCalendarHeading>
        <div
          v-if="showTwoMonths"
          class="text-center"
        >
          <span class="text-sm font-semibold whitespace-nowrap text-primary">
            {{ getMonthName(month.value.month - 1, locale, 'long') }} {{ month.value.year }}
          </span>
        </div>

        <div
          v-else
          class="flex items-center justify-center gap-xxs"
        >
          <Select
            v-model="monthValue"
            :icon-right="null"
            :class-config="{
              root: 'h-8 shadow-none border-none outline-none hover:bg-primary-hover focus-within:bg-primary-hover',
              baseSingle: 'font-semibold px-sm',
              content: 'gap-xs grid [grid-template-columns:auto] sm:[grid-template-columns:repeat(auto-fit,minmax(6rem,1fr))]',
              popover: {
                content: 'min-w-60',
              },
            }"
            :filter="{
              isEnabled: true,
            }"
            :display-fn="(monthIndex) => getMonthName(monthIndex - 1, locale, 'long')"
            popover-align="start"
          >
            <SelectItem
              v-for="i in 12"
              :key="i"
              :value="i"
            >
              {{ getMonthName(i - 1, locale, 'long') }}
            </SelectItem>
          </Select>

          <NumberField
            v-model="yearValue"
            :class-config="{
              root: 'h-8 shadow-none border-none outline-none hover:bg-primary-hover focus-within:bg-primary-hover',
              input: 'font-semibold px-sm',
            }"
            :format-options="{
              useGrouping: false,
            }"
            :hide-controls="true"
            class="w-12 shrink-0"
          />
        </div>
      </RekaRangeCalendarHeading>

      <RekaRangeCalendarNext
        v-if="index === (grid.length - 1)"
        :as-child="true"
      >
        <IconButton
          :class-config="{
            icon: 'group-enabled/button:group-hover/button:translate-x-px group-enabled/button:group-active/button:translate-x-0.5 duration-200',
          }"
          icon="chevronRight"
          label="Next month"
          variant="tertiary"
          size="sm"
          class="justify-self-end"
        />
      </RekaRangeCalendarNext>

      <span v-else />
    </RekaRangeCalendarHeader>
  </div>
</template>
