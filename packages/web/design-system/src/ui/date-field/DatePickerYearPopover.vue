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
import { datePickerYearPopoverStyle } from '@/ui/date-field/datePickerYearPopover.style'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import { UIButton } from '@/ui/button'

const props = defineProps<{
  placeholder: CalendarDate
}>()

const emit = defineEmits<{
  'update:placeholder': [value: CalendarDate]
}>()

const i18n = useI18n()

const locale = navigator.language

const yearOpen = ref(false)

const yearLabel = computed(() => String(props.placeholder.year))

function onYearSelect(value: DateValue | DateValue[] | undefined): void {
  if (value == null || Array.isArray(value)) {
    return
  }

  emit('update:placeholder', new CalendarDate(value.year, props.placeholder.month, 1))
  yearOpen.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="yearOpen">
    <PopoverTrigger :as-child="true">
      <UIButton
        :label="yearLabel"
        size="xs"
        variant="tertiary"
        class="font-semibold"
      >
      </UIButton>
    </PopoverTrigger>
    <PopoverPortal>
      <ThemeProvider :as-child="true">
        <PopoverContent
          :class="datePickerYearPopoverStyle.pickerPopover()"
          :side-offset="8"
          :collision-padding="10"
          align="center"
        >
          <YearPickerRoot
            v-slot="{ grid }"
            :locale="locale"
            :model-value="props.placeholder"
            @update:model-value="onYearSelect"
          >
            <ColumnLayout>
              <div :class="datePickerYearPopoverStyle.header()">
                <YearPickerPrev :as-child="true">
                  <IconButton
                    :icon="ChevronLeftIcon"
                    :label="i18n.t('component.date_picker.previous_year_page')"
                    size="md"
                    variant="tertiary"
                  />
                </YearPickerPrev>

                <YearPickerHeading :class="datePickerYearPopoverStyle.heading()" />

                <YearPickerNext :as-child="true">
                  <IconButton
                    :icon="ChevronRightIcon"
                    :label="i18n.t('component.date_picker.next_year_page')"
                    size="md"
                    variant="tertiary"
                  />
                </YearPickerNext>
              </div>

              <YearPickerGrid :class="datePickerYearPopoverStyle.pickerGrid()">
                <YearPickerGridBody :class="datePickerYearPopoverStyle.pickerGridBody()">
                  <YearPickerGridRow
                    v-for="(row, rowIndex) in grid.rows"
                    :key="rowIndex"
                    :class="datePickerYearPopoverStyle.pickerGridRow()"
                  >
                    <YearPickerCell
                      v-for="year in row"
                      :key="year.toString()"
                      :class="datePickerYearPopoverStyle.pickerCell()"
                      :date="year"
                    >
                      <YearPickerCellTrigger
                        v-slot="{ yearValue }"
                        :year="year"
                        :class="datePickerYearPopoverStyle.pickerCellTrigger()"
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
