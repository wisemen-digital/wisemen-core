<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectDateRangePickerContext } from '@/ui/date-range-picker/dateRangePicker.context'

interface Preset {
  key: string
  label: string
  range: { end: Temporal.PlainDate
    start: Temporal.PlainDate } | null
}

const i18n = useI18n()

const {
  draftValue, setPreset,
} = useInjectDateRangePickerContext()

const presets = computed<Preset[]>(() => {
  const today = Temporal.Now.plainDateISO()

  const dayOfWeek = today.dayOfWeek
  const startOfWeek = today.subtract({
    days: dayOfWeek - 1,
  })

  const endOfWeek = startOfWeek.add({
    days: 6,
  })

  const startOfLastWeek = startOfWeek.subtract({
    days: 7,
  })
  const endOfLastWeek = startOfWeek.subtract({
    days: 1,
  })

  const startOfMonth = today.with({
    day: 1,
  })
  const endOfMonth = today.with({
    day: today.daysInMonth,
  })

  const startOfLastMonth = startOfMonth.subtract({
    months: 1,
  })
  const endOfLastMonth = startOfMonth.subtract({
    days: 1,
  })

  const startOfYear = today.with({
    day: 1,
    month: 1,
  })
  const endOfYear = today.with({
    day: 31,
    month: 12,
  })

  const startOfLastYear = startOfYear.subtract({
    years: 1,
  })
  const endOfLastYear = startOfYear.subtract({
    days: 1,
  })

  const yesterday = today.subtract({
    days: 1,
  })

  return [
    {
      key: 'today',
      label: i18n.t('component.date_range_picker.preset.today'),
      range: {
        end: today,
        start: today,
      },
    },
    {
      key: 'yesterday',
      label: i18n.t('component.date_range_picker.preset.yesterday'),
      range: {
        end: yesterday,
        start: yesterday,
      },
    },
    {
      key: 'this_week',
      label: i18n.t('component.date_range_picker.preset.this_week'),
      range: {
        end: endOfWeek,
        start: startOfWeek,
      },
    },
    {
      key: 'last_week',
      label: i18n.t('component.date_range_picker.preset.last_week'),
      range: {
        end: endOfLastWeek,
        start: startOfLastWeek,
      },
    },
    {
      key: 'this_month',
      label: i18n.t('component.date_range_picker.preset.this_month'),
      range: {
        end: endOfMonth,
        start: startOfMonth,
      },
    },
    {
      key: 'last_month',
      label: i18n.t('component.date_range_picker.preset.last_month'),
      range: {
        end: endOfLastMonth,
        start: startOfLastMonth,
      },
    },
    {
      key: 'this_year',
      label: i18n.t('component.date_range_picker.preset.this_year'),
      range: {
        end: endOfYear,
        start: startOfYear,
      },
    },
    {
      key: 'last_year',
      label: i18n.t('component.date_range_picker.preset.last_year'),
      range: {
        end: endOfLastYear,
        start: startOfLastYear,
      },
    },
    {
      key: 'all_time',
      label: i18n.t('component.date_range_picker.preset.all_time'),
      range: null,
    },
  ]
})

function isActivePreset(preset: Preset): boolean {
  if (preset.range === null) {
    return draftValue.value.start == null && draftValue.value.end == null
  }

  if (draftValue.value.start == null || draftValue.value.end == null) {
    return false
  }

  const draftStart = draftValue.value.start
  const draftEnd = draftValue.value.end

  return (
    draftStart.year === preset.range.start.year
    && draftStart.month === preset.range.start.month
    && draftStart.day === preset.range.start.day
    && draftEnd.year === preset.range.end.year
    && draftEnd.month === preset.range.end.month
    && draftEnd.day === preset.range.end.day
  )
}
</script>

<template>
  <div
    class="flex w-32 shrink-0 flex-col gap-xxs border-r border-secondary p-xl"
  >
    <button
      v-for="preset in presets"
      :key="preset.key"
      :data-active="isActivePreset(preset)"
      class="
        flex w-full cursor-pointer items-center rounded-lg px-sm py-xs text-left
        text-xs font-medium text-secondary transition-colors duration-100
        outline-none
        hover:bg-primary-hover
        focus-visible:ring-2 focus-visible:ring-fg-brand-primary
        data-[active=true]:bg-brand-secondary
        data-[active=true]:text-brand-secondary
      "
      type="button"
      @click="setPreset(preset.range)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>
