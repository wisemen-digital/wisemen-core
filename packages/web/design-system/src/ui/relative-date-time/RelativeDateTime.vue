<script setup lang="ts">
import type { DateTimeInstant } from '@wisemen/vue-core-dates'
import { useDateTimeFormat } from '@wisemen/vue-core-dates'
import { Temporal } from 'temporal-polyfill'
import {
  ref,
  useAttrs,
} from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip'
import DateTime from '@/ui/date-time/DateTime.vue'
import { isMobileDevice } from '@/utils/device.util'

const props = withDefaults(defineProps<{
  dateTime: DateTimeInstant
  leadingText?: string | null
}>(), {
  leadingText: null,
})

const attrs = useAttrs()
const now = Temporal.Now.instant()

const dateFormat = useDateTimeFormat()

const isRelativeTimeVisible = ref<boolean>(true)

function onToggleRelativeTime(): void {
  if (isMobileDevice()) {
    isRelativeTimeVisible.value = !isRelativeTimeVisible.value
  }
}
</script>

<template>
  <UIActionTooltip :label="dateFormat.toDateTime(props.dateTime, true)">
    <span v-bind="attrs">
      {{ props.leadingText }}

      <DateTime
        :value="dateFormat.toDateTime(props.dateTime, true)"
        class="whitespace-nowrap"
        @click="onToggleRelativeTime"
      >
        <template v-if="isRelativeTimeVisible">
          {{ dateFormat.toRelativeTime(props.dateTime, now) }}
        </template>
        <template v-else>{{ dateFormat.toDateTime(props.dateTime, true) }}</template>
      </DateTime>
    </span>
  </UIActionTooltip>
</template>
