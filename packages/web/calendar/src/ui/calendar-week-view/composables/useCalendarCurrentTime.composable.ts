import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const CURRENT_TIME_REFRESH_INTERVAL_MS = 30_000

export function useCalendarCurrentTime(): {
  currentZonedDateTime: Ref<Temporal.ZonedDateTime>
} {
  const currentZonedDateTime = ref<Temporal.ZonedDateTime>(Temporal.Now.zonedDateTimeISO())

  let intervalId: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    intervalId = setInterval(() => {
      currentZonedDateTime.value = Temporal.Now.zonedDateTimeISO()
    }, CURRENT_TIME_REFRESH_INTERVAL_MS)
  })

  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })

  return {
    currentZonedDateTime,
  }
}
