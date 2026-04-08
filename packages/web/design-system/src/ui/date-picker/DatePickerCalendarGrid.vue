<script setup lang="ts">
import {
  DatePickerCell as RekaDatePickerCell,
  DatePickerCellTrigger as RekaDatePickerCellTrigger,
  DatePickerGrid as RekaDatePickerGrid,
  DatePickerGridBody as RekaDatePickerGridBody,
  DatePickerGridHead as RekaDatePickerGridHead,
  DatePickerGridRow as RekaDatePickerGridRow,
  DatePickerHeadCell as RekaDatePickerHeadCell,
} from 'reka-ui'

import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'

const props = defineProps<{
  month: any
  weekDays: string[]
}>()

const {
  datePickerStyle, onClose,
} = useInjectDatePickerContext()
</script>

<template>
  <RekaDatePickerGrid :class="datePickerStyle.grid()">
    <RekaDatePickerGridHead>
      <RekaDatePickerGridRow :class="datePickerStyle.gridRow()">
        <RekaDatePickerHeadCell
          v-for="day in props.weekDays"
          :key="day"
          :class="datePickerStyle.headCell()"
        >
          {{ day }}
        </RekaDatePickerHeadCell>
      </RekaDatePickerGridRow>
    </RekaDatePickerGridHead>

    <RekaDatePickerGridBody>
      <RekaDatePickerGridRow
        v-for="(week, weekIndex) in props.month.rows"
        :key="weekIndex"
        :class="datePickerStyle.gridRow()"
      >
        <RekaDatePickerCell
          v-for="date in week"
          :key="date.toString()"
          :date="date"
          :class="datePickerStyle.cell()"
        >
          <RekaDatePickerCellTrigger
            v-slot="{ today }"
            :day="date"
            :month="props.month.value"
            :class="datePickerStyle.cellTrigger()"
            class="group/cell"
            @click="onClose"
          >
            {{ date.day }}

            <span
              v-if="today"
              :class="datePickerStyle.todayIndicator()"
            />
          </RekaDatePickerCellTrigger>
        </RekaDatePickerCell>
      </RekaDatePickerGridRow>
    </RekaDatePickerGridBody>
  </RekaDatePickerGrid>
</template>
