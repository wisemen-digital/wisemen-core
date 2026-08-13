<script setup lang="ts">
import {
  UIDatePicker,
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

import type {
  DateFilter,
  DateFilterValue,
} from '@/composables'

const props = defineProps<{
  filter: DateFilter
  initialValue: DateFilterValue
}>()

const emit = defineEmits<{
  submit: [value: DateFilterValue]
}>()

const i18n = useI18n()

const value = ref(props.initialValue.value)

function setFilter(): void {
  emit('submit', {
    operator: props.initialValue.operator,
    value: value.value ?? null,
  })
}

function onClear(): void {
  value.value = null
}
</script>

<template>
  <UIDialog size="xxs">
    <UIDialogHeader
      :title="props.filter.label"
      :hide-description="true"
      description=""
    />

    <UIDialogBody>
      <UIDatePicker
        v-model="value"
        class="p-none!"
        :has-fixed-weeks="true"
      />
    </UIDialogBody>

    <UIDialogFooter>
      <template #left>
        <UIDialogFooterSecondary
          :label="i18n.t('component.filters_date_dialog.clear')"
          :is-disabled="value === null"
          class="mr-auto"
          @click="onClear"
        />
      </template>

      <template #right>
        <UIDialogFooterCancel :label="i18n.t('component.filters_date_dialog.cancel')" />

        <UIDialogFooterPrimary
          :label="i18n.t('component.filters_date_dialog.set_filter')"
          @click="setFilter"
        />
      </template>
    </UIDialogFooter>
  </UIDialog>
</template>
