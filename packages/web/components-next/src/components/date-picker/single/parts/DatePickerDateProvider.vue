<script setup lang="ts">
import type { DateValue } from 'reka-ui'

import { useProvideDatePickerDateContext } from '@/components/date-picker/shared/datePickerDate.context'

const props = defineProps<{
  date: DateValue
  month: DateValue
}>()

useProvideDatePickerDateContext({
  date: props.date,
  month: props.month,
})
</script>

<template>
  <slot />
</template>
