<script setup lang="ts">
import type { PlainDateRange } from '@wisemen/vue-core-dates'
import {
  UIDateRangePicker,
  UIDialog,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterPrimary,
  UIDialogFooterSecondary,
  UIDialogHeader,
} from '@wisemen/vue-core-design-system'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { DateRangeFilter } from '@/composables'

const props = defineProps<{
  filter: DateRangeFilter
  initialValue: PlainDateRange
}>()

const emit = defineEmits<{
  submit: [value: PlainDateRange]
}>()

const i18n = useI18n()

const value = ref<PlainDateRange>(props.initialValue)

function setFilter(): void {
  emit('submit', value.value ?? {
    from: null,
    until: null,
  })
}

function onClear(): void {
  value.value = {
    from: null,
    until: null,
  }
}
</script>

<template>
  <UIDialog size="lg">
    <UIDialogHeader
      :title="props.filter.label"
      :hide-description="true"
      description="Description"
    />

    <UIDialogBody>
      <UIDateRangePicker
        v-model="value"
        :show-presets="false"
      />
    </UIDialogBody>

    <UIDialogFooter>
      <template #left>
        <UIDialogFooterSecondary
          :label="i18n.t('component.filters_date_range_dialog.clear')"
          :is-disabled="value.from === null || value.until === null"
          class="mr-auto"
          @click="onClear"
        />
      </template>

      <template #right>
        <UIDialogFooterCancel :label="i18n.t('component.filters_date_range_dialog.cancel')" />

        <UIDialogFooterPrimary
          :label="i18n.t('component.filters_date_range_dialog.set_filter')"
          @click="setFilter"
        />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
