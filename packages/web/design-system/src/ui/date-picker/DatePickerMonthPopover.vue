<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import {
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const {
  datePickerStyle,
  placeholder,
  setPlaceholder,
} = useInjectDatePickerContext()

const locale = navigator.language

const monthOpen = ref(false)

const monthLabel = computed<string>(() =>
  new Intl.DateTimeFormat(locale, {
    month: 'long',
  })
    .format(new Date(placeholder.value.year, placeholder.value.month - 1, 1)))

function onMonthSelect(value: DateValue | DateValue[] | undefined): void {
  if (value == null || Array.isArray(value)) {
    return
  }

  setPlaceholder(new CalendarDate(value.year, value.month, 1))
  monthOpen.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="monthOpen">
    <PopoverTrigger :as-child="true">
      <button
        :class="datePickerStyle.headingTrigger()"
        type="button"
      >
        {{ monthLabel }}
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <ThemeProvider :as-child="true">
        <PopoverContent
          :class="datePickerStyle.pickerPopover()"
          :side-offset="8"
          align="center"
        >
          <MonthPickerRoot
            v-slot="{ grid }"
            :locale="locale"
            :model-value="placeholder"
            @update:model-value="onMonthSelect"
          >
            <MonthPickerGrid :class="datePickerStyle.pickerGrid()">
              <MonthPickerGridBody :class="datePickerStyle.pickerGridBody()">
                <MonthPickerGridRow
                  v-for="(row, rowIndex) in grid.rows"
                  :key="rowIndex"
                  :class="datePickerStyle.pickerGridRow()"
                >
                  <MonthPickerCell
                    v-for="month in row"
                    :key="month.toString()"
                    :class="datePickerStyle.pickerCell()"
                    :date="month"
                  >
                    <MonthPickerCellTrigger
                      v-slot="{ monthValue }"
                      :month="month"
                      :class="datePickerStyle.pickerCellTrigger()"
                    >
                      {{ monthValue }}
                    </MonthPickerCellTrigger>
                  </MonthPickerCell>
                </MonthPickerGridRow>
              </MonthPickerGridBody>
            </MonthPickerGrid>
          </MonthPickerRoot>
        </PopoverContent>
      </ThemeProvider>
    </PopoverPortal>
  </PopoverRoot>
</template>
