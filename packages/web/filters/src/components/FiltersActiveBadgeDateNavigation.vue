<script setup lang="ts">
import {
  createAction,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import type { PlainDate } from '@wisemen/vue-core-dates'
import {
  UIActionTooltip,
  UIActionTrigger,
  UIClickableElement,
} from '@wisemen/vue-core-design-system'
import {
  CalendarCheck01Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import FiltersActiveBadgePartSeparator from '@/components/FiltersActiveBadgePartSeparator.vue'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filterId: string
  from: PlainDate | null
  until: PlainDate | null
}>()

const emit = defineEmits<{
  navigate: [from: PlainDate, until: PlainDate]
}>()

const {
  actionGroup,
} = useInjectFiltersContext()

const i18n = useI18n()

type NavigationPeriod = 'custom' | 'day' | 'month' | 'week' | 'year'

const navigationPeriod = computed<NavigationPeriod>(() => {
  const {
    from, until,
  } = props

  if (from === null || until === null) {
    return 'day'
  }

  if (from.equals(until)) {
    return 'day'
  }

  if (from.month === 1 && from.day === 1 && until.month === 12 && until.day === 31 && from.year === until.year) {
    return 'year'
  }

  if (from.day === 1 && until.equals(from.add({
    months: 1,
  }).add({
    days: -1,
  }) as PlainDate)) {
    return 'month'
  }

  if ((from.add({
    days: 6,
  }) as PlainDate).equals(until)) {
    return 'week'
  }

  return 'custom'
})

const previousActionName = computed<string>(() => {
  switch (navigationPeriod.value) {
    case 'day': return i18n.t('component.filters_date_navigation.previous_day')
    case 'week': return i18n.t('component.filters_date_navigation.previous_week')
    case 'month': return i18n.t('component.filters_date_navigation.previous_month')
    case 'year': return i18n.t('component.filters_date_navigation.previous_year')
    case 'custom': return i18n.t('component.filters_date_navigation.previous_period')
    default:
      throw new Error('invalid period')
  }
})

const nextActionName = computed<string>(() => {
  switch (navigationPeriod.value) {
    case 'day': return i18n.t('component.filters_date_navigation.next_day')
    case 'week': return i18n.t('component.filters_date_navigation.next_week')
    case 'month': return i18n.t('component.filters_date_navigation.next_month')
    case 'year': return i18n.t('component.filters_date_navigation.next_year')
    case 'custom': return i18n.t('component.filters_date_navigation.next_period')
    default:
      throw new Error('invalid period')
  }
})

function navigate(delta: number): void {
  const today = Temporal.Now.plainDateISO()

  if (props.from === null) {
    emit('navigate', today as PlainDate, today as PlainDate)

    return
  }

  const from = props.from
  const until = props.until ?? from

  switch (navigationPeriod.value) {
    case 'day': {
      const updatedDate = from.add({
        days: delta,
      }) as PlainDate

      emit('navigate', updatedDate, updatedDate)

      break
    }
    case 'week': {
      emit('navigate', from.add({
        weeks: delta,
      }) as PlainDate, until.add({
        weeks: delta,
      }) as PlainDate)

      break
    }
    case 'month': {
      const updatedFrom = from.add({
        months: delta,
      }) as PlainDate
      const updatedUntil = updatedFrom.add({
        months: 1,
      }).add({
        days: -1,
      }) as PlainDate

      emit('navigate', updatedFrom, updatedUntil)

      break
    }
    case 'year': {
      const updatedFrom = from.add({
        years: delta,
      }) as PlainDate

      emit('navigate', updatedFrom, updatedFrom.with({
        day: 31,
        month: 12,
      }) as PlainDate)

      break
    }
    case 'custom': {
      const totalDays = until.since(from, {
        largestUnit: 'day',
      }).days + 1

      emit('navigate', from.add({
        days: delta * totalDays,
      }) as PlainDate, until.add({
        days: delta * totalDays,
      }) as PlainDate)

      break
    }
  }
}

const previousAction = createAction({
  id: `${props.filterId}-previous`,
  isApplicable: (ctx) => ctx.menuType === undefined,
  name: () => previousActionName.value,
  execute: () => navigate(-1),
  group: actionGroup,
  icon: () => ChevronLeftIcon,
  keyboardShortcut: {
    key: 'ArrowLeft',
  },
})

const nextAction = createAction({
  id: `${props.filterId}-next`,
  isApplicable: (ctx) => ctx.menuType === undefined,
  name: () => nextActionName.value,
  execute: () => navigate(1),
  group: actionGroup,
  icon: () => ChevronRightIcon,
  keyboardShortcut: {
    key: 'ArrowRight',
  },
})

const todayAction = createAction({
  id: `${props.filterId}-today`,
  isApplicable: (ctx) => ctx.menuType === undefined,
  name: () => i18n.t('component.filters_date_navigation.today'),
  execute: () => {
    const today = Temporal.Now.plainDateISO()

    emit('navigate', today as PlainDate, today as PlainDate)
  },
  group: actionGroup,
  icon: () => CalendarCheck01Icon,
  keyboardShortcut: {
    key: 'T',
  },
})

useTemporaryActions(todayAction)
</script>

<template>
  <UIActionTrigger
    v-slot="{ label, keyboardShortcut }"
    :action="previousAction"
    :is-current-context-only="false"
  >
    <UIActionTooltip
      :label="label"
      :keyboard-shortcut="keyboardShortcut"
    >
      <UIClickableElement>
        <button
          :aria-label="label"
          type="button"
          class="
            flex h-full w-4 shrink-0 items-center justify-center rounded-none!
            hover:bg-fg-primary/2
            dark:hover:bg-fg-primary/5
          "
          @click="navigate(-1)"
        >
          <ChevronLeftIcon class="size-3.5 text-primary" />
        </button>
      </UIClickableElement>
    </UIActionTooltip>
  </UIActionTrigger>

  <FiltersActiveBadgePartSeparator />

  <slot />

  <FiltersActiveBadgePartSeparator />

  <UIActionTrigger
    v-slot="{ label, keyboardShortcut }"
    :action="nextAction"
    :is-current-context-only="false"
  >
    <UIActionTooltip
      :label="label"
      :keyboard-shortcut="keyboardShortcut"
    >
      <UIClickableElement>
        <button
          :aria-label="label"
          type="button"
          class="
            flex h-full w-4 shrink-0 items-center justify-center rounded-none!
            hover:bg-fg-primary/2
            dark:hover:bg-fg-primary/5
          "
          @click="navigate(1)"
        >
          <ChevronRightIcon class="size-3.5 text-primary" />
        </button>
      </UIClickableElement>
    </UIActionTooltip>
  </UIActionTrigger>
</template>
