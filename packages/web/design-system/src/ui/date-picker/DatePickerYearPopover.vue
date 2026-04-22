<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import type { DateValue } from 'reka-ui'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerHeading,
  YearPickerNext,
  YearPickerPrev,
  YearPickerRoot,
} from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import IconButton from '@/ui/button/icon/IconButton.vue'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

const i18n = useI18n()

const {
  datePickerStyle,
  placeholder,
  setPlaceholder,
} = useInjectDatePickerContext()

const locale = navigator.language

const yearOpen = ref(false)

const yearLabel = computed(() => String(placeholder.value.year))

function onYearSelect(value: DateValue | DateValue[] | undefined): void {
  if (value == null || Array.isArray(value)) {
    return
  }

  setPlaceholder(new CalendarDate(value.year, placeholder.value.month, 1))
  yearOpen.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="yearOpen">
    <PopoverTrigger :as-child="true">
      <button
        :class="datePickerStyle.headingTrigger()"
        type="button"
      >
        {{ yearLabel }}
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <ThemeProvider :as-child="true">
        <PopoverContent
          :class="datePickerStyle.pickerPopover()"
          :side-offset="8"
          align="center"
        >
          <YearPickerRoot
            v-slot="{ grid }"
            :locale="locale"
            :model-value="placeholder"
            @update:model-value="onYearSelect"
          >
            <ColumnLayout>
              <div :class="datePickerStyle.header()">
                <YearPickerPrev :as-child="true">
                  <IconButton
                    :icon="ChevronLeftIcon"
                    :label="i18n.t('component.date_picker.previous_year_page')"
                    size="md"
                    variant="tertiary"
                  />
                </YearPickerPrev>

                <YearPickerHeading :class="datePickerStyle.heading()" />

                <YearPickerNext :as-child="true">
                  <IconButton
                    :icon="ChevronRightIcon"
                    :label="i18n.t('component.date_picker.next_year_page')"
                    size="md"
                    variant="tertiary"
                  />
                </YearPickerNext>
              </div>

              <YearPickerGrid :class="datePickerStyle.pickerGrid()">
                <YearPickerGridBody :class="datePickerStyle.pickerGridBody()">
                  <YearPickerGridRow
                    v-for="(row, rowIndex) in grid.rows"
                    :key="rowIndex"
                    :class="datePickerStyle.pickerGridRow()"
                  >
                    <YearPickerCell
                      v-for="year in row"
                      :key="year.toString()"
                      :class="datePickerStyle.pickerCell()"
                      :date="year"
                    >
                      <YearPickerCellTrigger
                        v-slot="{ yearValue }"
                        :year="year"
                        :class="datePickerStyle.pickerCellTrigger()"
                      >
                        {{ yearValue }}
                      </YearPickerCellTrigger>
                    </YearPickerCell>
                  </YearPickerGridRow>
                </YearPickerGridBody>
              </YearPickerGrid>
            </ColumnLayout>
          </YearPickerRoot>
        </PopoverContent>
      </ThemeProvider>
    </PopoverPortal>
  </PopoverRoot>
</template>
