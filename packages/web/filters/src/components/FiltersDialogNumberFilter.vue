<script setup lang="ts">
import {
  toFormField,
  UIDialogBody,
  UIDialogFooter,
  UIDialogFooterCancel,
  UIDialogFooterSubmit,
  UIDialogHeader,
  UIFormDialog,
  UIIconButton,
  UINumberField,
  UIText,
} from '@wisemen/vue-core-design-system'
import { XCloseIcon } from '@wisemen/vue-core-icons'
import { useForm } from 'formango'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'
import z from 'zod'

import type { NumberFilter } from '@/composables'

const props = defineProps<{
  filter: NumberFilter
  initialValue: number | null
}>()

const emit = defineEmits<{
  submit: [value: number | null]
}>()

const i18n = useI18n()
const id = useId()

const form = useForm({
  schema: z.object({
    value: z.number()
      .min(props.filter.min ?? Number.MIN_SAFE_INTEGER)
      .max(props.filter.max ?? Number.MAX_SAFE_INTEGER)
      .nullable(),
  }),
  onSubmit: (values) => {
    emit('submit', values.value)
  },
})

const valueField = form.register('value', props.initialValue)
</script>

<template>
  <UIFormDialog
    :form="form"
    size="xxs"
  >
    <UIDialogHeader
      :title="props.filter.label"
      :hide-description="true"
      description=""
    />

    <UIDialogBody>
      <label
        :for="id"
        class="sr-only"
      >
        {{ props.filter.label }}
      </label>

      <UINumberField
        v-bind="toFormField(valueField)"
        :id="id"
        :format-options="props.filter.formatOptions"
        :placeholder="props.filter.placeholder ?? i18n.t('component.filters_number_dialog.placeholder')"
      >
        <template #right>
          <UIText
            v-if="props.filter.customUnit !== undefined"
            :text="props.filter.customUnit"
            :truncate="false"
            class="mr-sm text-xs text-tertiary"
          />

          <UIIconButton
            v-if="valueField.value.value !== null"
            :icon="XCloseIcon"
            :label="i18n.t('component.filters_number_dialog.clear')"
            size="xs"
            variant="tertiary"
            class="mr-xs"
            @click="valueField.setValue(null)"
          />
        </template>
      </UINumberField>
    </UIDialogBody>

    <UIDialogFooter>
      <UIDialogFooterCancel :label="i18n.t('component.filters_number_dialog.cancel')" />
      <UIDialogFooterSubmit :label="i18n.t('component.filters_number_dialog.set_filter')" />
    </UIDialogFooter>
  </UIFormDialog>
</template>
