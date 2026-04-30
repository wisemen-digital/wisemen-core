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

import { UIButton } from '@/ui/button'
import { datePickerMonthPopoverStyle } from '@/ui/date-field/datePickerMonthPopover.style'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const props = defineProps<{
  placeholder: CalendarDate
}>()

const emit = defineEmits<{
  'update:placeholder': [value: CalendarDate]
}>()

const locale = navigator.language

const monthOpen = ref(false)

const monthLabel = computed<string>(() =>
  new Intl.DateTimeFormat(locale, {
    month: 'long',
  })
    .format(new Date(props.placeholder.year, props.placeholder.month - 1, 1)))

function onMonthSelect(value: DateValue | DateValue[] | undefined): void {
  if (value == null || Array.isArray(value)) {
    return
  }

  emit('update:placeholder', new CalendarDate(value.year, value.month, 1))
  monthOpen.value = false
}
</script>

<template>
  <PopoverRoot
    v-model:open="monthOpen"
  >
    <PopoverTrigger :as-child="true">
      <UIButton
        :label="monthLabel"
        size="xs"
        variant="tertiary"
        class="font-semibold"
      />
    </PopoverTrigger>
    <PopoverPortal>
      <ThemeProvider :as-child="true">
        <PopoverContent
          :class="datePickerMonthPopoverStyle.pickerPopover()"
          :side-offset="8"
          :collision-padding="10"
          align="center"
        >
          <MonthPickerRoot
            v-slot="{ grid }"
            :locale="locale"
            :model-value="props.placeholder"
            @update:model-value="onMonthSelect"
          >
            <MonthPickerGrid :class="datePickerMonthPopoverStyle.pickerGrid()">
              <MonthPickerGridBody :class="datePickerMonthPopoverStyle.pickerGridBody()">
                <MonthPickerGridRow
                  v-for="(row, rowIndex) in grid.rows"
                  :key="rowIndex"
                  :class="datePickerMonthPopoverStyle.pickerGridRow()"
                >
                  <MonthPickerCell
                    v-for="month in row"
                    :key="month.toString()"
                    :class="datePickerMonthPopoverStyle.pickerCell()"
                    :date="month"
                  >
                    <MonthPickerCellTrigger
                      v-slot="{ monthValue }"
                      :month="month"
                      :class="datePickerMonthPopoverStyle.pickerCellTrigger()"
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
