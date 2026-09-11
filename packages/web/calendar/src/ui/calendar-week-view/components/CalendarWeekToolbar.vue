<script setup lang="ts">
import {
  UIButton,
  UIIconButton,
  UIRowLayout,
  UIText,
} from '@wisemen/vue-core-design-system'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import type { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

const props = defineProps<{
  weekDays: Temporal.PlainDate[]
}>()

const emit = defineEmits<{
  next: []
  prev: []
  today: []
}>()

const dateRangeLabel = computed<string>(() => {
  const firstDay = props.weekDays[0]
  const lastDay = props.weekDays.at(-1)

  if (firstDay === undefined || lastDay === undefined) {
    return ''
  }

  const lastDayLabel = lastDay.toLocaleString(undefined, {
    day: 'numeric',
    month: firstDay.month === lastDay.month ? undefined : 'long',
    year: firstDay.year === lastDay.year ? undefined : 'numeric',
  })

  const firstDayLabel = firstDay.toLocaleString(undefined, {
    day: 'numeric',
    month: 'long',
    year: firstDay.year === lastDay.year ? 'numeric' : undefined,
  })

  return `${firstDayLabel} - ${lastDayLabel}`
})
</script>

<template>
  <UIRowLayout
    gap="lg"
    class="
      h-(--wui-calendar-toolbar-height,3rem) shrink-0 border-b border-gray-200
      px-3
    "
  >
    <UIButton
      label="Today"
      variant="secondary"
      size="sm"
      @click="emit('today')"
    />

    <UIRowLayout gap="none">
      <UIIconButton
        :icon="ChevronLeftIcon"
        label="Previous week"
        variant="tertiary"
        size="sm"
        @click="emit('prev')"
      />

      <UIIconButton
        :icon="ChevronRightIcon"
        label="Next week"
        variant="tertiary"
        size="sm"
        @click="emit('next')"
      />
    </UIRowLayout>

    <UIText
      :text="dateRangeLabel"
      class="text-sm font-semibold text-gray-900"
    />
  </UIRowLayout>
</template>
